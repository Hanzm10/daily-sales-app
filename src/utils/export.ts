import XLSX from 'xlsx-js-style';
import type { Worker, DayData } from '../types';
import { getYYYYMMDD, calculateUnrecordedPenalty } from './helpers';

export const handleExport = (
    currentDate: Date,
    workers: Worker[],
    entries: Record<string, DayData>,
    showNotification: (message: string, type: 'success' | 'info') => void
) => {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Styles
    const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center" }
    };
    const yellowStyle = { ...headerStyle, fill: { fgColor: { rgb: "FFFF00" } } };
    const creamStyle = { ...headerStyle, fill: { fgColor: { rgb: "F5DEB3" } } };
    const redTextStyle = { font: { bold: true, color: { rgb: "FF0000" } } };

    // Header
    const headerRow = [
        { v: `Date: ${new Date(year, month).toLocaleString('en-US', { month: 'short', year: 'numeric' })}`, s: headerStyle },
        { v: "Unrecorded", s: yellowStyle },
        { v: "Short", s: yellowStyle },
        { v: "Short Penalty (+50)", s: creamStyle },
        { v: "Total Penalty", s: creamStyle }
    ];
    workers.forEach(w => headerRow.push({ v: w.name, s: headerStyle }));

    // Data Rows Generation
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dataRows = [];

    let totalUnrecorded = 0;
    let totalShortInput = 0;
    let totalPenalty = 0;
    const workerTotals: Record<number, number> = {};
    workers.forEach(w => workerTotals[w.id] = 0);

    for (let d = 1; d <= daysInMonth; d++) {
        const dObj = new Date(year, month, d);
        const dKey = getYYYYMMDD(dObj);
        const entry = entries[dKey];

        // Only include if there is data (Unrecorded or Short)
        if (entry && (entry.unrecorded > 0 || entry.short > 0)) {

            const unrecP = calculateUnrecordedPenalty(entry.unrecorded);
            const shortP = entry.short > 0 ? entry.short + 50 : 0;
            const totalP = unrecP + shortP;

            const activeWorkerIds = entry.attendance;
            const activeCount = activeWorkerIds.length;
            const pPerPerson = (activeCount > 0) ? totalP / activeCount : 0;

            totalUnrecorded += entry.unrecorded;
            totalShortInput += entry.short;
            totalPenalty += totalP;

            const rowCells: any[] = [
                { v: `${String(month + 1).padStart(2, '0')}/${String(d).padStart(2, '0')}/${String(year).slice(-2)}`, t: 's' },
                { v: entry.unrecorded, t: 'n', z: '#,##0.00' },
                { v: entry.short, t: 'n', z: '#,##0.00' },
                { v: shortP, t: 'n', z: '#,##0.00' },
                { v: totalP, t: 'n', z: '#,##0.00' }
            ];

            workers.forEach(w => {
                const isWorking = activeWorkerIds.includes(w.id);
                if (isWorking) {
                    rowCells.push({ v: pPerPerson, t: 'n', z: '#,##0.00' });
                    workerTotals[w.id] += pPerPerson;
                } else {
                    rowCells.push({ v: "OFF", t: 's', s: { font: { color: { rgb: "AAAAAA" } } } });
                }
            });

            dataRows.push(rowCells);
        }
    }

    // Totals Row
    const totalRow = [
        { v: "TOTAL", s: { font: { bold: true } } },
        { v: totalUnrecorded, t: 'n', z: '#,##0.00', s: redTextStyle },
        { v: totalShortInput, t: 'n', z: '#,##0.00', s: redTextStyle },
        { v: "-", t: 's', s: { alignment: { horizontal: "center" } } },
        { v: totalPenalty, t: 'n', z: '#,##0.00', s: redTextStyle }
    ];
    workers.forEach(w => {
        totalRow.push({ v: workerTotals[w.id], t: 'n', z: '#,##0.00', s: redTextStyle });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows, totalRow]);

    const wscols = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    workers.forEach(() => wscols.push({ wch: 12 }));
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Short Report");
    XLSX.writeFile(wb, `Short_Report_${month + 1}_${year}.xlsx`);

    showNotification("Excel report downloaded successfully!", "info");
};

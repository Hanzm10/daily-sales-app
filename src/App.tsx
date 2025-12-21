import React, { useState, useEffect } from 'react';
import XLSX from 'xlsx-js-style';
import { Trash2, Plus, Download, Users, Calendar, AlertCircle, ChevronLeft, ChevronRight, Save, CheckCircle2, X } from 'lucide-react';

// --- Utility Functions ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(value);
};

const formatDateLong = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
};

const getYYYYMMDD = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

const calculateUnrecordedPenalty = (amount: number) => {
  const val = parseFloat(amount.toString()) || 0;
  if (val <= 0) return 0;
  if (val <= 50) return 0;
  if (val <= 100) return 50;
  if (val <= 150) return 75;
  if (val <= 200) return 100;
  return val; // Above 200, penalty is actual amount
};

// --- Interfaces ---
interface Worker {
  id: number;
  name: string;
}

interface DayData {
  unrecorded: number;
  short: number;
  attendance: number[]; // Array of worker IDs who worked
}

interface NotificationState {
  message: string;
  type: 'success' | 'info';
}

// --- Main Component ---

export default function App() {
  // --- Global State ---
  // Configuration
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Workers State (Persisted)
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('workers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Worker A' },
      { id: 2, name: 'Worker B' },
      { id: 3, name: 'Worker C' },
      { id: 4, name: 'Worker D' }
    ];
  });

  const [newWorkerName, setNewWorkerName] = useState('');

  // Main Data Store (Persisted) key: "YYYY-MM-DD" -> DayData
  const [entries, setEntries] = useState<Record<string, DayData>>(() => {
    const saved = localStorage.getItem('entries');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Local Form State (For the current day being edited) ---
  const [formUnrecorded, setFormUnrecorded] = useState<string>('');
  const [formShort, setFormShort] = useState<string>('');
  const [formAttendance, setFormAttendance] = useState<number[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  // Load data into form when date changes
  useEffect(() => {
    const dateKey = getYYYYMMDD(currentDate);
    const savedData = entries[dateKey];

    if (savedData) {
      setFormUnrecorded(savedData.unrecorded > 0 ? savedData.unrecorded.toString() : '');
      setFormShort(savedData.short > 0 ? savedData.short.toString() : '');
      setFormAttendance(savedData.attendance);
    } else {
      setFormUnrecorded('');
      setFormShort('');
      setFormAttendance(workers.map(w => w.id));
    }
  }, [currentDate, entries, workers]);

  // --- Handlers ---

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 3000);
  };

  const addWorker = () => {
    if (!newWorkerName.trim()) return;
    const newWorker = { id: Date.now(), name: newWorkerName.trim() };
    setWorkers([...workers, newWorker]);
    setNewWorkerName('');
    setFormAttendance(prev => [...prev, newWorker.id]);
  };

  const removeWorker = (id: number) => {
    setWorkers(workers.filter(w => w.id !== id));
    setFormAttendance(prev => prev.filter(wId => wId !== id));
  };

  const toggleWorkerAttendance = (workerId: number) => {
    setFormAttendance(prev => {
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      } else {
        return [...prev, workerId];
      }
    });
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleSave = () => {
    const dateKey = getYYYYMMDD(currentDate);
    const unrecVal = parseFloat(formUnrecorded) || 0;
    const shortVal = parseFloat(formShort) || 0;

    const newEntry: DayData = {
      unrecorded: unrecVal,
      short: shortVal,
      attendance: formAttendance
    };

    setEntries(prev => ({
      ...prev,
      [dateKey]: newEntry
    }));

    showNotification("Entry Saved! Moving to next day...", "success");

    // Auto-advance to next day
    navigateDate(1);
  };

  // --- Calculations for Display ---

  const currentUnrecordedPenalty = calculateUnrecordedPenalty(parseFloat(formUnrecorded) || 0);
  const currentShortPenalty = (parseFloat(formShort) || 0) > 0 ? (parseFloat(formShort) || 0) + 50 : 0;
  const currentTotalPenalty = currentUnrecordedPenalty + currentShortPenalty;
  const workerCount = formAttendance.length;
  const penaltyPerPerson = (workerCount > 0 && currentTotalPenalty > 0) ? currentTotalPenalty / workerCount : 0;


  // --- Export Logic ---

  const handleExport = () => {

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 flex flex-col gap-6 relative">

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all animate-[slideIn_0.3s_ease-out]">
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {notification.type === 'success' ? <CheckCircle2 size={24} /> : <Download size={24} />}
          </div>
          <div>
            <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">
              {notification.type === 'success' ? 'Success' : 'System'}
            </p>
            <p className="font-medium text-sm md:text-base">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Top Bar: Title & Period */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="text-blue-600" />
            Unrecorded & Short Tracker
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <Calendar size={18} className="text-gray-500" />
          <select
            className="bg-transparent font-semibold text-gray-700 outline-none cursor-pointer"
            value={currentDate.getMonth()}
            onChange={(e) => {
              const d = new Date(currentDate);
              d.setMonth(parseInt(e.target.value));
              setCurrentDate(d);
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <input
            type="number"
            className="w-20 bg-transparent font-semibold text-gray-700 outline-none border-l border-gray-300 pl-2"
            value={currentDate.getFullYear()}
            onChange={(e) => {
              const d = new Date(currentDate);
              d.setFullYear(parseInt(e.target.value));
              setCurrentDate(d);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Management */}
        <div className="space-y-6">
          {/* Worker Management */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-purple-600 border-b pb-2">
              <Users size={20} />
              <h2 className="font-semibold">Worker Management</h2>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Name..."
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWorker()}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                onClick={addWorker}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                  <span className="font-medium">{worker.name}</span>
                  <button onClick={() => removeWorker(worker.id)} className="text-red-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {workers.length === 0 && <p className="text-center text-xs text-gray-400">No workers.</p>}
            </div>
          </div>

          {/* Rules Legend (Compact) */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm">
            <h3 className="font-bold text-blue-800 mb-2">Penalty Rules</h3>
            <div className="space-y-2 text-xs text-blue-800">
              <div className="flex justify-between"><span>0-50</span> <span>Free</span></div>
              <div className="flex justify-between"><span>51-100</span> <span>₱50</span></div>
              <div className="flex justify-between"><span>101-150</span> <span>₱75</span></div>
              <div className="flex justify-between"><span>151-200</span> <span>₱100</span></div>
              <div className="flex justify-between"><span>Short</span> <span>Input + ₱50</span></div>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all active:scale-95"
          >
            <Download size={20} />
            Export Excel Report  {/* Removed the ternary operator for "Loading..." */}
          </button>
        </div>

        {/* Center/Right Col: Daily Entry Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full flex flex-col">

            {/* Day Navigator */}
            <div className="bg-gray-800 text-white p-6 flex items-center justify-between">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronLeft size={28} />
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold">{formatDateLong(currentDate)}</h2>
                <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-semibold">
                  Daily Entry
                </p>
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Input Form */}
            <div className="p-6 md:p-8 flex-1 flex flex-col gap-8">

              {/* Money Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Unrecorded Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                    <input
                      type="number"
                      min="0"
                      disabled={parseFloat(formShort) > 0}
                      value={formUnrecorded}
                      onChange={(e) => { setFormUnrecorded(e.target.value); }}
                      className="w-full pl-8 pr-4 py-3 text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  {currentUnrecordedPenalty > 0 && (
                    <p className="text-red-500 text-sm font-medium">Penalty: {formatCurrency(currentUnrecordedPenalty)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Short Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                    <input
                      type="number"
                      min="0"
                      disabled={parseFloat(formUnrecorded) > 0}
                      value={formShort}
                      onChange={(e) => { setFormShort(e.target.value); }}
                      className="w-full pl-8 pr-4 py-3 text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-0 outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-colors text-red-600"
                      placeholder="0.00"
                    />
                  </div>
                  {currentShortPenalty > 0 && (
                    <p className="text-red-500 text-sm font-medium">Penalty: {formatCurrency(currentShortPenalty)}</p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Attendance Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-gray-500 uppercase">Who worked today?</label>
                  {currentTotalPenalty > 0 && workerCount > 0 && (
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      Share: {formatCurrency(penaltyPerPerson)} / person
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {workers.map(w => {
                    const isSelected = formAttendance.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        onClick={() => toggleWorkerAttendance(w.id)}
                        className={`
                          relative flex items-center p-3 rounded-lg border-2 transition-all
                          ${isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-gray-200 hover:border-gray-300 text-gray-500'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}
                        `}>
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className="font-semibold">{w.name}</span>
                      </button>
                    )
                  })}
                  {workers.length === 0 && <p className="col-span-full text-center text-gray-400 italic py-4">Add workers on the left to select attendance.</p>}
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-auto pt-6 flex flex-col md:flex-row gap-4 items-center border-t border-gray-100">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-500 text-sm">Total Daily Penalty</p>
                  <p className="text-3xl font-black text-gray-800">{formatCurrency(currentTotalPenalty)}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    onClick={handleSave}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Save Entry
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
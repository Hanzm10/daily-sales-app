import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, AlertTriangle, CircleDollarSign } from 'lucide-react';
import type { Worker, DayData } from '../types';
import { formatDateLong, formatCurrency, calculateUnrecordedPenalty } from '../utils/helpers';

interface EntryFormProps {
    currentDate: Date;
    entry: DayData | undefined;
    workers: Worker[];
    onSave: (data: DayData) => void;
    onNavigateDate: (days: number) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({
    currentDate,
    entry,
    workers,
    onSave,
    onNavigateDate
}) => {
    const [formUnrecorded, setFormUnrecorded] = useState<string>('');
    const [formShort, setFormShort] = useState<string>('');
    const [formAttendance, setFormAttendance] = useState<number[]>([]);

    // Load data into form when entry or date changes
    useEffect(() => {
        if (entry) {
            setFormUnrecorded(entry.unrecorded > 0 ? entry.unrecorded.toString() : '');
            setFormShort(entry.short > 0 ? entry.short.toString() : '');
            setFormAttendance(entry.attendance);
        } else {
            setFormUnrecorded('');
            setFormShort('');
            setFormAttendance(workers.map(w => w.id));
        }
    }, [entry, workers]);

    // Handlers
    const toggleWorkerAttendance = (workerId: number) => {
        setFormAttendance(prev => {
            if (prev.includes(workerId)) {
                return prev.filter(id => id !== workerId);
            } else {
                return [...prev, workerId];
            }
        });
    };

    const handleSaveClick = () => {
        const unrecVal = parseFloat(formUnrecorded) || 0;
        const shortVal = parseFloat(formShort) || 0;

        const newEntry: DayData = {
            unrecorded: unrecVal,
            short: shortVal,
            attendance: formAttendance
        };
        onSave(newEntry);
    };

    // Calculations
    const currentUnrecordedPenalty = calculateUnrecordedPenalty(parseFloat(formUnrecorded) || 0);
    const currentShortPenalty = (parseFloat(formShort) || 0) > 0 ? (parseFloat(formShort) || 0) + 50 : 0;
    const currentTotalPenalty = currentUnrecordedPenalty + currentShortPenalty;
    const workerCount = formAttendance.length;
    const penaltyPerPerson = (workerCount > 0 && currentTotalPenalty > 0) ? currentTotalPenalty / workerCount : 0;

    return (
        <div className="glass rounded-2xl flex flex-col h-full animate-slide-in relative overflow-hidden" style={{ animationDelay: '0.2s' }}>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 -z-10 opacity-50"></div>

            {/* Day Navigator */}
            <div className="p-6 pb-2 flex items-center justify-between border-b border-gray-100/50">
                <button
                    onClick={() => onNavigateDate(-1)}
                    className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="text-center group cursor-default">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight group-hover:scale-105 transition-transform duration-300">
                        {formatDateLong(currentDate)}
                    </h2>
                    <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest mt-1">Daily Entry</p>
                </div>

                <button
                    onClick={() => onNavigateDate(1)}
                    className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Input Form */}
            <div className="p-6 md:p-10 flex-1 flex flex-col gap-10">

                {/* Money Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Unrecorded Input */}
                    <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${parseFloat(formUnrecorded) > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-dashed border-gray-200 hover:border-orange-200 hover:bg-orange-50/10'}`}>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            <AlertTriangle size={14} className={parseFloat(formUnrecorded) > 0 ? "text-orange-500" : ""} />
                            Unrecorded Amount
                        </label>
                        <div className="relative group/input">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-2xl group-focus-within/input:text-orange-400 transition-colors">₱</span>
                            <input
                                type="number"
                                min="0"
                                disabled={parseFloat(formShort) > 0}
                                value={formUnrecorded}
                                onChange={(e) => { setFormUnrecorded(e.target.value); }}
                                className="w-full pl-8 py-2 text-3xl font-black bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-200 transition-colors disabled:opacity-20"
                                placeholder="0.00"
                            />
                        </div>
                        <div className={`mt-2 text-sm font-medium transition-all ${currentUnrecordedPenalty > 0 ? 'text-orange-500 opacity-100' : 'opacity-0 translate-y-2'}`}>
                            + {formatCurrency(currentUnrecordedPenalty)} Penalty
                        </div>
                    </div>

                    {/* Short Input */}
                    <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${parseFloat(formShort) > 0 ? 'border-red-200 bg-red-50/30' : 'border-dashed border-gray-200 hover:border-red-200 hover:bg-red-50/10'}`}>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            <CircleDollarSign size={14} className={parseFloat(formShort) > 0 ? "text-red-500" : ""} />
                            Short Amount
                        </label>
                        <div className="relative group/input">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-2xl group-focus-within/input:text-red-400 transition-colors">₱</span>
                            <input
                                type="number"
                                min="0"
                                disabled={parseFloat(formUnrecorded) > 0}
                                value={formShort}
                                onChange={(e) => { setFormShort(e.target.value); }}
                                className="w-full pl-8 py-2 text-3xl font-black bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-200 transition-colors disabled:opacity-20"
                                placeholder="0.00"
                            />
                        </div>
                        <div className={`mt-2 text-sm font-medium transition-all ${currentShortPenalty > 0 ? 'text-red-500 opacity-100' : 'opacity-0 translate-y-2'}`}>
                            + {formatCurrency(currentShortPenalty)} Penalty
                        </div>
                    </div>
                </div>

                {/* Attendance Selection */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-lg font-bold text-gray-700">Attendance</h3>
                        </div>
                        {currentTotalPenalty > 0 && workerCount > 0 && (
                            <div className="animate-fade-in-scale bg-red-50 border border-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                Share: {formatCurrency(penaltyPerPerson)} / person
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {workers.map(w => {
                            const isSelected = formAttendance.includes(w.id);
                            return (
                                <button
                                    key={w.id}
                                    onClick={() => toggleWorkerAttendance(w.id)}
                                    className={`
                    group relative flex items-center p-3 rounded-xl border-2 transition-all duration-200 active:scale-95
                    ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50/50 shadow-indigo-100 shadow-lg'
                                            : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200 text-gray-500'
                                        }
                  `}
                                >
                                    <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors duration-300
                    ${isSelected ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-300 group-hover:text-gray-400'}
                  `}>
                                        <CheckCircle2 size={16} className={`transition-all duration-300 ${isSelected ? 'scale-100' : 'scale-75 opacity-50'}`} />
                                    </div>
                                    <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-500'}`}>{w.name}</span>

                                    {isSelected && <div className="absolute inset-0 rounded-xl border-2 border-indigo-500 opacity-50 animate-pulse"></div>}
                                </button>
                            )
                        })}
                        {workers.length === 0 && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">Add workers to track attendance</div>}
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-auto flex flex-col md:flex-row gap-6 items-center">
                    {/* Total Display */}
                    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl w-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Daily Penalty</p>
                        <p className="text-4xl md:text-5xl font-black tracking-tight">{formatCurrency(currentTotalPenalty)}</p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveClick}
                        className="w-full md:w-auto flex-1 h-full min-h-[100px] bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group"
                    >
                        <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform duration-300">
                            <Save size={24} />
                        </div>
                        <span>Save Entry</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

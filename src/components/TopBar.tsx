import React from 'react';
import { Calendar, Layers } from 'lucide-react';

interface TopBarProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentDate, onDateChange }) => {
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const d = new Date(currentDate);
        d.setMonth(parseInt(e.target.value));
        onDateChange(d);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const d = new Date(currentDate);
        d.setFullYear(parseInt(e.target.value));
        onDateChange(d);
    };

    return (
        <div className="glass rounded-2xl p-5 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-in">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shadow-sm">
                        <Layers size={24} />
                    </div>
                    Short Tracker
                </h1>
                <p className="text-gray-500 text-sm font-medium ml-12 -mt-1">Manage daily unrecorded & shorts</p>
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Calendar size={20} />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer text-lg hover:text-indigo-600 transition-colors"
                        value={currentDate.getMonth()}
                        onChange={handleMonthChange}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <span className="text-gray-300 text-xl font-light">/</span>
                    <input
                        type="number"
                        className="w-16 bg-transparent font-bold text-gray-700 outline-none text-lg hover:text-indigo-600 transition-colors"
                        value={currentDate.getFullYear()}
                        onChange={handleYearChange}
                    />
                </div>
            </div>
        </div>
    );
};

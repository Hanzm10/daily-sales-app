import React, { useState } from 'react';
import { Users, Plus, Trash2, Download, UserX } from 'lucide-react';
import type { Worker } from '../types';

interface WorkerManagementProps {
    workers: Worker[];
    onAddWorker: (name: string) => void;
    onRemoveWorker: (id: number) => void;
    onExport: () => void;
}

export const WorkerManagement: React.FC<WorkerManagementProps> = ({
    workers,
    onAddWorker,
    onRemoveWorker,
    onExport
}) => {
    const [newWorkerName, setNewWorkerName] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleAdd = () => {
        onAddWorker(newWorkerName);
        setNewWorkerName('');
    };

    return (
        <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            {/* Worker Management */}
            <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-purple-300/30"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Users size={20} />
                    </div>
                    <h2 className="font-bold text-gray-800 text-lg">Team Members</h2>
                </div>

                <div className="flex gap-2 mb-6 shadow-sm rounded-xl p-1 bg-gray-50 border border-gray-100 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                    <input
                        type="text"
                        placeholder="Add new member..."
                        value={newWorkerName}
                        onChange={(e) => setNewWorkerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 bg-transparent border-none p-2 pl-3 text-sm font-medium outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newWorkerName.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {workers.map(worker => (
                        <div key={worker.id} className="group/item flex justify-between items-center bg-white hover:bg-purple-50 p-3 rounded-xl border border-gray-100 hover:border-purple-100 transition-all animate-fade-in-scale">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                    {worker.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-700">{worker.name}</span>
                            </div>

                            {confirmDeleteId === worker.id ? (
                                <div className="flex items-center gap-2 animate-fade-in-scale">
                                    <span className="text-xs text-red-500 font-bold">Sure?</span>
                                    <button onClick={() => { onRemoveWorker(worker.id); setConfirmDeleteId(null); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => setConfirmDeleteId(null)} className="text-gray-400 hover:text-gray-600 text-xs px-2">Cancel</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDeleteId(worker.id)}
                                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {workers.length === 0 && (
                        <div className="text-center py-8 opacity-60">
                            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <UserX size={24} />
                            </div>
                            <p className="text-sm text-gray-400">No active members yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Export */}
            <button
                onClick={onExport}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                <Download size={20} className="relative z-10" />
                <span className="relative z-10">Export Report</span>
            </button>
        </div>
    );
};

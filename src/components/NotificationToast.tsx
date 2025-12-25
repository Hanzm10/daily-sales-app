import React from 'react';
import { CheckCircle2, Download, X } from 'lucide-react';
import type { NotificationState } from '../types';

interface NotificationToastProps {
    notification: NotificationState;
    onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
    return (
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
                onClick={onClose}
                className="ml-2 text-gray-500 hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
};

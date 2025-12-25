import React from 'react';

export const PenaltyRules: React.FC = () => {
    return (
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
    );
};

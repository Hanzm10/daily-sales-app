import { useState, useEffect } from 'react';
import type { DayData } from '../types';

export function useEntries() {
    const [entries, setEntries] = useState<Record<string, DayData>>(() => {
        const saved = localStorage.getItem('entries');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    const saveEntry = (dateKey: string, data: DayData) => {
        setEntries(prev => ({
            ...prev,
            [dateKey]: data
        }));
    };

    const getEntry = (dateKey: string) => {
        return entries[dateKey];
    };

    return { entries, saveEntry, getEntry };
}

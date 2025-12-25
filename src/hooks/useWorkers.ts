import { useState, useEffect } from 'react';
import type { Worker } from '../types';

export function useWorkers() {
    const [workers, setWorkers] = useState<Worker[]>(() => {
        const saved = localStorage.getItem('workers');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Worker A' },
            { id: 2, name: 'Worker B' },
            { id: 3, name: 'Worker C' },
            { id: 4, name: 'Worker D' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('workers', JSON.stringify(workers));
    }, [workers]);

    const addWorker = (name: string) => {
        if (!name.trim()) return;
        const newWorker = { id: Date.now(), name: name.trim() };
        setWorkers([...workers, newWorker]);
        return newWorker.id;
    };

    const removeWorker = (id: number) => {
        setWorkers(workers.filter(w => w.id !== id));
    };

    return { workers, addWorker, removeWorker };
}

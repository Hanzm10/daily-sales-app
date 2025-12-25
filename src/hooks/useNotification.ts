import { useState, useCallback } from 'react';
import type { NotificationState } from '../types';

export function useNotification() {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(prev => (prev?.message === message ? null : prev));
        }, 3000);
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return { notification, showNotification, hideNotification };
}

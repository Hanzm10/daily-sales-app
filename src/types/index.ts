export interface Worker {
    id: number;
    name: string;
}

export interface DayData {
    unrecorded: number;
    short: number;
    attendance: number[]; // Array of worker IDs who worked
}

export interface NotificationState {
    message: string;
    type: 'success' | 'info';
}

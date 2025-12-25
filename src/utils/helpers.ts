export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(value);
};

export const formatDateLong = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
};

export const getYYYYMMDD = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yy = date.getFullYear();
    return `${yy}-${mm}-${dd}`;
};

export const calculateUnrecordedPenalty = (amount: number) => {
    const val = parseFloat(amount.toString()) || 0;
    if (val <= 0) return 0;
    if (val <= 50) return 0;
    if (val <= 100) return 50;
    if (val <= 150) return 75;
    if (val <= 200) return 100;
    return val; // Above 200, penalty is actual amount
};

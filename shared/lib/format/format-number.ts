export const formatNumberRU = (n: number) =>
    new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(n);
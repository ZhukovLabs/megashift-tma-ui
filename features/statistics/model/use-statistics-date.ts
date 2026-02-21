import {useState} from "react";

export const useStatisticsDate = () => {
    const [date, setDate] = useState(new Date());

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const shiftMonth = (delta: number) =>
        setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

    return {
        year,
        month,
        next: () => shiftMonth(1),
        prev: () => shiftMonth(-1),
        set: (y: number, m: number) =>
            setDate(new Date(y, m - 1, 1)),
    };
}
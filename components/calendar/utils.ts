import {startOfMonth, startOfWeek} from "date-fns";

export function getMonthDates(month: Date) {
    const monthStart = startOfMonth(month);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    return { monthStart, startDate };
}
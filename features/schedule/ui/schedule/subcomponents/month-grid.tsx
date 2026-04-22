import { useMemo } from "react";
import { WeekRow } from "./week-row";
import { useSchedule } from "../context";

type MonthType = "prev" | "current" | "next";

export const MonthGrid = ({ monthType }: { monthType: MonthType }) => {
    const { currentDate, prevDate, nextDate, getCalendarDays } = useSchedule();

    const monthDate = monthType === "prev" ? prevDate : monthType === "next" ? nextDate : currentDate;

    const weeks = useMemo(() => {
        const days = getCalendarDays(monthDate);
        const weeksArray: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeksArray.push(days.slice(i, i + 7));
        }
        return weeksArray;
    }, [monthDate, getCalendarDays]);

    return (
        <div className="flex flex-col flex-1 w-full h-full">
            {weeks.map((week, w) => (
                <WeekRow key={w} week={week} monthDate={monthDate} />
            ))}
        </div>
    );
};

import React from "react";
import { addDays } from "date-fns";
import { getMonthDates } from "../utils";
import { WeekRow } from "./week-row";
import { useSchedule } from "../context";

type MonthType = "prev" | "current" | "next";

export const MonthGrid = ({ monthType }: { monthType: MonthType }) => {
    const { currentDate, prevDate, nextDate } = useSchedule();

    const monthDate = monthType === "prev" ? prevDate : monthType === "next" ? nextDate : currentDate;

    const { startDate } = getMonthDates(monthDate);

    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: 6 }, (_, w) => {
                const weekStart = addDays(startDate, w * 7);
                return <WeekRow key={w} weekStart={weekStart} monthDate={monthDate} />;
            })}
        </div>
    );
};

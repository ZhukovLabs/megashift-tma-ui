import React from "react";
import { addDays } from "date-fns";
import { DayCell } from "./day-cell";
import cn from "classnames";
import { useSchedule } from "@/components/schedule/context";

export const WeekRow = ({ weekStart, monthDate }: { weekStart: Date, monthDate: Date }) => {
    const { cellHeight } = useSchedule();

    return (
        <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }, (_, i) => {
                const day = addDays(weekStart, i);

                const cellClasses = cn(
                    "flex justify-center rounded-lg transition-colors",
                    "hover:bg-base-200/70 cursor-pointer"
                );

                return (
                    <div key={day.getTime()} style={{ height: cellHeight }} className={cellClasses}>
                        <DayCell day={day} monthDate={monthDate} />
                    </div>
                );
            })}
        </div>
    );
};
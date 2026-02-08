import React from "react";
import {addDays} from "date-fns";
import {DayCell} from "./day-cell";

export const WeekRow = ({weekStart, monthDate}: { weekStart: Date; monthDate: Date }) => {
    return (
        <div className="grid grid-cols-7">
            {Array.from({length: 7}, (_, i) => {
                const day = addDays(weekStart, i);

                return <DayCell key={day.getTime()} day={day} monthDate={monthDate}/>;
            })}
        </div>
    );
};

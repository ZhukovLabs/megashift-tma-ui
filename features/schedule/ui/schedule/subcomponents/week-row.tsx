import { memo } from "react";
import { DayCell } from "./day-cell";

type WeekRowProps = {
    week: Date[];
    monthDate: Date;
};

export const WeekRow = memo(function WeekRow({ week, monthDate }: WeekRowProps) {
    return (
        <>
            {week.map((day, i) => (
                <DayCell 
                    key={day.getTime()} 
                    day={day} 
                    monthDate={monthDate}
                    isLastInRow={i === 6}
                />
            ))}
        </>
    );
});

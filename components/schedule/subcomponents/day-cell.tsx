import {format, isSameMonth, isToday} from "date-fns";
import cn from "classnames";
import {useSchedule} from "@/components/schedule/context";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

export const DayCell = ({day, monthDate}: DayCellProps) => {
   const {cellHeight}= useSchedule();
    const isCurrentMonth = isSameMonth(day, monthDate);
    const isCurrentDay = isToday(day);

    const dayBlockClasses = 'flex justify-center rounded-lg hover:bg-base-200/70 cursor-pointer transition-colors';

    const dayTextClasses = cn(
        "flex items-center justify-center rounded-full transition-all w-10 h-10",
        "text-sm font-medium",
        {
            "text-base-content/25": !isCurrentMonth,
            "text-base-content": isCurrentMonth,
            "bg-primary text-primary-content font-semibold shadow-sm": isCurrentDay,
        }
    );

    return (
        <div
            key={day.getTime()}
            style={{height: cellHeight}}
            className={dayBlockClasses}
        >
            <div className={dayTextClasses}>
                {format(day, "d")}
            </div>
        </div>
    );
};

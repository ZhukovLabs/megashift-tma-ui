import { format, isSameMonth, isToday } from "date-fns";
import cn from "classnames";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

export const DayCell = ({ day, monthDate }: DayCellProps) => {
    const isCurrentMonth = isSameMonth(day, monthDate);
    const isCurrentDay = isToday(day);

    const dayClasses = cn(
        "w-9 h-9 flex items-center justify-center rounded-full",
        "text-sm font-medium transition-all",
        {
            "text-base-content/25": !isCurrentMonth,
            "text-base-content": isCurrentMonth,
            "bg-primary text-primary-content font-semibold shadow-sm": isCurrentDay,
        }
    );

    return <div className={dayClasses}>{format(day, "d")}</div>;
};
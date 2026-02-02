import {format, isSameMonth, isToday} from "date-fns";
import cn from "classnames";

type DayCellProps = {
    day: Date
}

export const DayCell = ({day}: DayCellProps) => {
    const isCurrentMonth = isSameMonth(day, new Date());
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
}

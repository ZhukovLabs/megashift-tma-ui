import { format, isSameMonth, isToday, isSameDay } from "date-fns";
import cn from "classnames";
import { useSchedule } from "@/components/schedule/context";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

export const DayCell = ({ day, monthDate }: DayCellProps) => {
    const { cellHeight, events } = useSchedule();

    const isCurrentMonth = isSameMonth(day, monthDate);
    const isCurrentDay = isToday(day);

    const dayEvents = events.filter(ev => isSameDay(ev.date, day));

    const dayBlockClasses = cn(
        "flex flex-col justify-between rounded-lg transition-colors p-1 cursor-pointer",
        {
            "bg-base-200 hover:bg-base-200/70": isCurrentMonth,
            "bg-base-300/50 hover:bg-base-300/70": !isCurrentMonth,
            "border-1 border-accent/50": isCurrentDay,
        }
    );

    const dayTextClasses = cn(
        "flex items-center justify-center rounded-full w-10 h-10 text-sm font-semibold transition-all",
        {
            "text-base-content/25": !isCurrentMonth,
            "text-base-content": isCurrentMonth,
            "bg-primary text-primary-content shadow-md": isCurrentDay,
        }
    );

    return (
        <div
            style={{ height: cellHeight }}
            className={dayBlockClasses}
            aria-label={`День ${format(day, "d MMMM yyyy")}, событий: ${dayEvents.length}`}
        >
            <div className={dayTextClasses}>{format(day, "d")}</div>

            <div className="flex flex-col gap-1 mt-auto">
                {dayEvents.map(ev => (
                    <div
                        key={ev.id}
                        className="text-xs rounded-md px-1.5 py-0.5 truncate shadow-sm transition-transform duration-150"
                        style={{
                            backgroundColor: ev.color || "#3b82f6",
                            color: "#fff",
                        }}
                        title={ev.title}
                    >
                        {ev.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

import { format, isSameMonth, isToday, isSameDay } from "date-fns";
import cn from "classnames";
import { useSchedule } from "@/components/schedule/context";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

const MAX_VISIBLE_EVENTS = 2; // максимум отображаемых событий

export const DayCell = ({ day, monthDate }: DayCellProps) => {
    const { events, onEventClick, cellHeight } = useSchedule();
    const dayEvents = events.filter(ev => isSameDay(ev.date, day));

    const isCurrentMonth = isSameMonth(day, monthDate);
    const isCurrentDay = isToday(day);

    const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
    const extraCount = dayEvents.length - visibleEvents.length;

    const dayBlockClasses = cn(
        "flex flex-col justify-between rounded-lg transition-colors p-1 cursor-pointer",
        {
            "bg-base-200 hover:bg-base-200/70": isCurrentMonth,
            "bg-base-300/50 hover:bg-base-300/70": !isCurrentMonth,
            "border-1 border-accent/50": isCurrentDay,
        }
    );

    const dayTextClasses = cn(
        "flex items-center justify-center rounded-full w-8 h-8 text-sm font-semibold transition-all",
        {
            "text-base-content/25": !isCurrentMonth,
            "text-base-content": isCurrentMonth,
            "bg-primary text-primary-content shadow-sm": isCurrentDay,
        }
    );

    return (
        <div
            style={{ height: cellHeight }}
            className={dayBlockClasses}
            aria-label={`День ${format(day, "d MMMM yyyy")}, событий: ${dayEvents.length}`}
        >
            {/* Число дня */}
            <div className={dayTextClasses}>{format(day, "d")}</div>

            {/* События — компактные, прижаты к низу */}
            <div className="flex flex-col gap-0.5 mt-auto">
                {visibleEvents.map(ev => (
                    <div
                        key={ev.id}
                        className="text-[10px] rounded px-1 py-[1px] truncate cursor-pointer"
                        style={{
                            backgroundColor: ev.color || "#3b82f6",
                            color: "#fff",
                            lineHeight: "1em",
                        }}
                        title={ev.title}
                        onClick={() => onEventClick?.(ev)}
                    >
                        {ev.title}
                    </div>
                ))}

                {extraCount > 0 && (
                    <div
                        className="text-[10px] rounded px-1 py-[1px] text-center bg-base-300/50 text-base-content/80 cursor-default"
                        title={`+${extraCount} дополнительных событий`}
                    >
                        +{extraCount} еще
                    </div>
                )}
            </div>
        </div>
    );
};

import {format, isSameMonth, isToday, isSameDay} from "date-fns";
import cn from "classnames";
import {useSchedule} from "@/components/schedule/context";
import {useGetShiftTemplates} from "@/api-hooks/use-get-shift-templates";
import {} from 'date-fns-tz';

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

const MAX_VISIBLE_EVENTS = 2;

export const DayCell = ({day, monthDate}: DayCellProps) => {
    const {shifts, onDayClick, cellHeight} = useSchedule();
    const {data: shiftTemplates = []} = useGetShiftTemplates();

    const dayEvents = shifts.filter(({date}) => isSameDay(date, day));

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
            "text-base-content": isCurrentMonth
        }
    );

    return (
        <div
            style={{height: cellHeight}}
            className={dayBlockClasses}
            aria-label={`День ${format(day, "d MMMM yyyy")}, событий: ${dayEvents.length}`}
            onClick={() => onDayClick?.(day, dayEvents)}
        >
            <div className={dayTextClasses}>{format(day, "d")}</div>

            <div className="flex flex-col gap-0.5 mt-auto">
                {visibleEvents.map(({id, shiftTemplateId}) => {
                        const shiftTemplate = shiftTemplates.find(({id}) => id === shiftTemplateId)! ?? {};

                        return (
                            <div
                                key={id}
                                className="text-[10px] rounded px-1 py-[1px] truncate cursor-pointer"
                                style={{
                                    backgroundColor: shiftTemplate.color,
                                    color: "#fff",
                                    lineHeight: "1em",
                                }}
                                title={shiftTemplate.label}
                            >
                                {shiftTemplate.label}
                            </div>
                        )
                    }
                )}

                {extraCount > 0 && (
                    <div
                        className="text-[10px] rounded px-1 py-[1px] text-center bg-base-300/50 text-base-content/80 cursor-default truncate"
                        title={`+${extraCount} дополнительных событий`}
                    >
                        +{extraCount} еще
                    </div>
                )}
            </div>
        </div>
    )
        ;
};

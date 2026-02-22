import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import cn from "classnames";
import { useMemo } from "react";
import { useSchedule } from "@/components/schedule/context";
import { useGetShiftTemplates } from "@/api-hooks/shift-template";
import { getContrastColor, lightenHex } from "@/utils/colors";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

const MAX_VISIBLE_EVENTS = 2;

const DEFAULT_EVENT_COLOR = "#64748b";
const DEFAULT_EVENT_LABEL = "(Без названия)";
const TIME_FORMAT = "HH:mm";

export const DayCell = ({ day, monthDate }: DayCellProps) => {
    const { shifts, onDayClick, cellHeight } = useSchedule();
    const { data: shiftTemplates = [] } = useGetShiftTemplates();

    const isCurrentMonth = isSameMonth(day, monthDate);
    const isCurrentDay = isToday(day);

    const templateMap = useMemo<Record<string, typeof shiftTemplates[number]>>(
        () => Object.fromEntries(shiftTemplates.map(t => [t.id, t])),
        [shiftTemplates]
    );

    const dayEvents = useMemo(
        () => shifts.filter(({ date }) => isSameDay(date, day)),
        [shifts, day]
    );

    const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
    const extraCount = dayEvents.length - visibleEvents.length;

    return (
        <div
            style={{ height: cellHeight }}
            onClick={() => onDayClick?.(day, dayEvents)}
            className={cn(
                "relative flex flex-col cursor-pointer select-none transition-colors duration-150",
                {
                    "bg-base-100": isCurrentMonth,
                    "bg-base-200/40 opacity-70": !isCurrentMonth,
                }
            )}
        >
            {isCurrentDay && (
                <div className="absolute inset-0 border-2 border-primary/60 rounded-sm pointer-events-none box-border z-0" />
            )}

            <div className="relative z-10 flex flex-col h-full p-[2px]">
                <div className="flex justify-center pt-1">
                    <div
                        className={cn("text-xs font-semibold", {
                            "text-primary": isCurrentDay,
                            "text-base-content": isCurrentMonth && !isCurrentDay,
                            "text-base-content/50": !isCurrentMonth,
                        })}
                    >
                        {format(day, "d")}
                    </div>
                </div>

                <div className="flex-1 px-1 pb-1 mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                    {visibleEvents.map(event => {
                        const template =
                            event.shiftTemplateId
                                ? templateMap[event.shiftTemplateId] ?? null
                                : null;

                        const label = template?.label ?? DEFAULT_EVENT_LABEL;
                        const baseColor = template?.color ?? DEFAULT_EVENT_COLOR;
                        const bgColor = lightenHex(baseColor, 10); // чуть светлее
                        const textColor = getContrastColor(baseColor); // читаемый текст

                        const startTime =
                            event.actualStartTime ?? template?.startTime;

                        return (
                            <div
                                key={event.id}
                                className="rounded-sm shadow-sm overflow-hidden text-center"
                                style={{ backgroundColor: bgColor, color: textColor }}
                            >
                                <div className="px-1 py-0.5 text-[10px] font-medium leading-none truncate">
                                    {label}
                                </div>

                                {startTime && (
                                    <div className="px-1 pb-0.5 text-[9px] bg-black/20 leading-none" style={{ color: textColor }}>
                                        {format(new Date(startTime), TIME_FORMAT)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {extraCount > 0 && (
                        <div className="mt-0.5 rounded-sm px-1 py-0.5 text-[10px] text-center text-base-content/70 bg-base-300/70 leading-none">
                            +{extraCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

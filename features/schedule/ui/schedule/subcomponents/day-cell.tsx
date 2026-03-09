import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import cn from "classnames";
import { useMemo } from "react";
import { useSchedule } from "../context";
import { useGetShiftTemplates } from "@/features/shift-template/api";
import { getContrastColor, lightenHex } from "@/shared/lib";
import {useUserStore} from "@/entities/user";

type DayCellProps = {
    day: Date;
    monthDate: Date;
};

const MAX_VISIBLE = 2;
const DEFAULT_COLOR = "#64748b";
const DEFAULT_LABEL = "(Без названия)";
const TIME_FORMAT = "HH:mm";

export const DayCell = ({ day, monthDate }: DayCellProps) => {
    const { shifts, onDayClick, cellHeight } = useSchedule();
    const { data: templates = [] } = useGetShiftTemplates();
    const tz = useUserStore(s => s.user?.timezone || "UTC");

    const isCurrentMonth = isSameMonth(day, monthDate);
    const isTodayDay = isToday(day);

    const templateMap = useMemo(
        () => Object.fromEntries(templates.map(t => [t.id, t])),
        [templates]
    );

    const events = useMemo(
        () => shifts.filter(s => isSameDay(s.date, day)),
        [shifts, day]
    );

    const visible = events.slice(0, MAX_VISIBLE);
    const more = events.length - visible.length;

    return (
        <div
            style={{ height: cellHeight }}
            onClick={() => onDayClick?.(day, events)}
            className={cn(
                "relative cursor-pointer select-none transition-colors",
                isCurrentMonth ? "bg-base-100" : "bg-base-200/30 opacity-70"
            )}
        >
            {isTodayDay && (
                <div className="absolute inset-0 border-2 border-primary/50 rounded pointer-events-none z-0" />
            )}

            <div className="relative z-10 flex flex-col h-full p-0.5">
                <div className="text-center pt-0.5">
          <span
              className={cn("text-xs font-medium", {
                  "text-primary": isTodayDay,
                  "text-base-content": isCurrentMonth && !isTodayDay,
                  "text-base-content/50": !isCurrentMonth
              })}
          >
            {format(day, "d")}
          </span>
                </div>

                <div className="flex-1 px-0.5 pb-0.5 flex flex-col gap-0.5 overflow-hidden">
                    {visible.map(event => {
                        const tpl = event.shiftTemplateId ? templateMap[event.shiftTemplateId] : null;
                        const label = tpl?.label ?? DEFAULT_LABEL;
                        const color = tpl?.color ?? DEFAULT_COLOR;
                        const textColor = getContrastColor(color);
                        const time = event.actualStartTime ?? tpl?.startTime;
                        const isActual = !!event.actualStartTime;

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "rounded text-[10px] font-medium text-center truncate shadow-sm",
                                    isActual ? "striped-bg" : ""
                                )}
                                style={{
                                    backgroundColor: isActual ? undefined : lightenHex(color, 12),
                                    backgroundImage: isActual
                                        ? `repeating-linear-gradient(45deg, ${lightenHex(color, 25)}, ${lightenHex(color, 25)} 4px, ${color} 4px, ${color} 8px)`
                                        : undefined,
                                    color: textColor
                                }}
                            >
                                <div className="px-1.5 py-0.5 leading-tight">{label}</div>
                                {time && (
                                    <div
                                        className="px-1.5 pb-0.5 text-[9px] bg-black/15 leading-none"
                                        style={{ color: textColor }}
                                    >
                                        {formatInTimeZone(new Date(time), tz, TIME_FORMAT)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {more > 0 && (
                        <div className="mt-0.5 rounded text-[10px] text-center text-base-content/60 bg-base-300/60 py-0.5 leading-none">
                            +{more} ещё
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

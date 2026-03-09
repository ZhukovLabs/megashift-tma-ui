import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import cn from "classnames";
import { useMemo, memo } from "react";
import { useSchedule } from "../context";
import { useGetShiftTemplates } from "@/features/shift-template/api";
import { getContrastColor, lightenHex } from "@/shared/lib";
import { useUserStore } from "@/entities/user";

type DayCellProps = {
    day: Date;
    monthDate: Date;
    isLastInRow?: boolean;
};

const MAX_VISIBLE = 2;
const DEFAULT_COLOR = "#64748b";
const DEFAULT_LABEL = "(Без названия)";
const TIME_FORMAT = "HH:mm";

export const DayCell = memo(function DayCell({ day, monthDate, isLastInRow }: DayCellProps) {
    const { shifts, onDayClick, config, isHoliday, isWeekend } = useSchedule();
    const { data: templates = [] } = useGetShiftTemplates();
    const tz = useUserStore(s => s.user?.timezone || "UTC");

    const isCurrentMonth = isSameMonth(day, monthDate);
    const isTodayDay = config.highlightToday && isToday(day);
    const holiday = isHoliday(day);
    const weekend = isWeekend(day);

    const templateMap = useMemo(
        () => new Map(templates.map(t => [t.id, t])),
        [templates]
    );

    const events = useMemo(
        () => shifts.filter(s => isSameDay(s.date, day)),
        [shifts, day]
    );

    const visible = events.slice(0, MAX_VISIBLE);
    const more = events.length - visible.length;

    const getDayClasses = () => {
        const classes: string[] = [
            "flex flex-col flex-1 min-h-0 cursor-pointer select-none transition-colors duration-150"
        ];

        if (!isCurrentMonth) {
            classes.push("bg-base-200");
        } else if (holiday) {
            classes.push("bg-error/15");
        } else if (config.showWeekends && weekend) {
            classes.push("bg-warning/10");
        } else {
            classes.push("bg-base-100");
        }

        return classes;
    };

    const getTextClasses = () => {
        const classes: string[] = [];

        if (isTodayDay) {
            classes.push("text-primary font-bold");
        } else if (isCurrentMonth) {
            if (holiday) {
                classes.push("text-error font-semibold");
            } else if (config.showWeekends && weekend) {
                classes.push("text-warning font-semibold");
            } else {
                classes.push("text-base-content");
            }
        } else {
            classes.push("text-base-content/40");
        }

        return classes;
    };

    return (
        <div
            onClick={() => onDayClick?.(day, events)}
            className={cn(
                getDayClasses(),
                "border-r border-b border-base-300",
                isLastInRow && "border-r-0",
                "w-full min-w-0 box-border"
            )}
        >
            <div className="flex flex-col h-full p-1 min-h-0">
                <div className="text-center shrink-0">
                    <span className={cn("text-sm font-semibold", getTextClasses())}>
                        {format(day, "d")}
                    </span>
                </div>

                <div className="flex-1 px-0.5 pb-0.5 flex flex-col gap-0.5 overflow-hidden min-h-0">
                    {visible.map(event => {
                        const tpl = event.shiftTemplateId ? templateMap.get(event.shiftTemplateId) : null;
                        const label = tpl?.label ?? DEFAULT_LABEL;
                        const color = tpl?.color ?? DEFAULT_COLOR;
                        const textColor = getContrastColor(color);
                        const time = event.actualStartTime ?? tpl?.startTime;
                        const isActual = !!event.actualStartTime;

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "rounded-sm text-[9px] font-medium text-center truncate shrink-0"
                                )}
                                style={{
                                    backgroundColor: lightenHex(color, isActual ? 10 : 20),
                                    color: textColor,
                                    lineHeight: 1.2,
                                }}
                            >
                                <div className="px-1 py-0.5 leading-tight">{label}</div>

                                {time && (
                                    <div
                                        className="px-1 pb-0.5 text-[8px] bg-black/10 leading-none"
                                        style={{ color: textColor }}
                                    >
                                        {formatInTimeZone(new Date(time), tz, TIME_FORMAT)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {more > 0 && (
                        <div className="mt-auto shrink-0 rounded text-[9px] text-center text-base-content/60 bg-base-200 py-0.5 leading-none font-medium">
                            +{more}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
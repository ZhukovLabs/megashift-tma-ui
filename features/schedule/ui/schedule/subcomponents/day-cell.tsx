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
const DEFAULT_LABEL = "(Без названия)";
const TIME_FORMAT = "HH:mm";

const TEMPLATE_PALETTE = [
    "#2563eb",
    "#16a34a",
    "#d97706",
    "#ef4444",
    "#7c3aed",
    "#0ea5a4",
    "#f97316",
    "#06b6d4",
];

function hashStringToIndex(s: string | number | undefined, modulo = TEMPLATE_PALETTE.length) {
    if (s == null) return 0;
    const str = String(s);
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h) % modulo;
}

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
        const classes: string[] = ["flex flex-col flex-1 min-h-0 cursor-pointer select-none transition-all duration-150"];

        if (holiday) {
            classes.push("bg-error/5");
        } else if (config.showWeekends && weekend) {
            if (config.weekendHighlight === "background" || config.weekendHighlight === "both") {
                classes.push("bg-error/10");
            } else {
                classes.push("bg-base-100");
            }
        } else if (!isCurrentMonth) {
            classes.push("bg-base-200/20");
        } else {
            classes.push("bg-base-100");
        }

        return classes;
    };

    const getTextClasses = () => {
        const classes: string[] = [];

        if (isTodayDay) {
            classes.push("text-primary font-bold");
        } else if (holiday) {
            classes.push("text-error font-bold");
        } else if (config.showWeekends && weekend) {
            if (config.weekendHighlight === "text" || config.weekendHighlight === "both") {
                classes.push("text-warning font-bold");
            } else {
                classes.push(isCurrentMonth ? "text-base-content" : "text-base-content/30");
            }
        } else {
            classes.push(isCurrentMonth ? "text-base-content" : "text-base-content/30");
        }

        return classes;
    };

    return (
        <div
            onClick={() => onDayClick?.(day, events)}
            className={cn(
                getDayClasses(),
                "border-r border-b border-base-300/30",
                isLastInRow && "border-r-0",
                "w-full min-w-0 box-border"
            )}
        >
            <div className="relative z-10 flex flex-col h-full p-1 min-h-0">
                <div className="text-center shrink-0">
                    <span className={cn("text-sm font-semibold", getTextClasses())}>
                        {format(day, "d")}
                    </span>
                </div>

                <div className="flex-1 px-0.5 pb-0.5 flex flex-col gap-0.5 overflow-hidden min-h-0">
                    {visible.map(event => {
                        const tpl = event.shiftTemplateId ? templateMap.get(event.shiftTemplateId) : null;
                        const label = tpl?.label ?? DEFAULT_LABEL;
                        const color = (tpl?.color && tpl.color.trim()) ?? TEMPLATE_PALETTE[hashStringToIndex(event.shiftTemplateId ?? event.id)];
                        const textColor = getContrastColor(color) ?? "#000000";
                        const time = event.actualStartTime ?? tpl?.startTime;
                        const isActual = !!event.actualStartTime;

                        const cardBackground = isActual
                            ? undefined
                            : lightenHex(color, 22);

                        const cardBackgroundImage = isActual
                            ? `repeating-linear-gradient(45deg, ${lightenHex(color, 28)}, ${lightenHex(color, 28)} 3px, ${color} 3px, ${color} 6px)`
                            : undefined;

                        const timeBg = "rgba(0,0,0,0.06)";

                        return (
                            <div
                                key={event.id}
                                className="rounded-sm text-[9px] font-medium text-center truncate transition-transform hover:scale-[1.02] shrink-0"
                                style={{
                                    backgroundColor: cardBackground,
                                    backgroundImage: cardBackgroundImage,
                                    color: textColor,
                                    lineHeight: 1.2,
                                }}
                                title={label}
                            >
                                <div className="px-1 py-0.5 leading-tight">{label}</div>

                                {time && (
                                    <div
                                        className="px-1 pb-0.5 text-[8px] leading-none"
                                        style={{
                                            color: textColor,
                                            background: timeBg,
                                            borderTopLeftRadius: 4,
                                            borderTopRightRadius: 4,
                                        }}
                                    >
                                        {formatInTimeZone(new Date(time), tz, TIME_FORMAT)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {more > 0 && (
                        <div className="mt-auto shrink-0 rounded text-[9px] text-center text-base-content/50 bg-base-300/40 py-0.5 leading-none font-medium">
                            +{more}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
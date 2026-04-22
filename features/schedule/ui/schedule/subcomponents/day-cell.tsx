import {format, isSameDay, isSameMonth, isToday} from "date-fns";
import {formatInTimeZone} from "date-fns-tz";
import cn from "classnames";
import {useMemo, memo} from "react";
import {useSchedule} from "../context";
import {useGetShiftTemplates} from "@/features/shift-template/api";
import {getContrastColor, lightenHex} from "@/shared/lib";
import {useUserStore} from "@/entities/user";
import {useTranslations} from "next-intl";

type DayCellProps = {
    day: Date;
    monthDate: Date;
    isLastInRow?: boolean;
};

const MAX_VISIBLE = 2;
const DEFAULT_LABEL = "";
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

export const DayCell = memo(function DayCell({day, monthDate, isLastInRow}: DayCellProps) {
    const {shifts, onDayClick, config, isHoliday, isWeekend} = useSchedule();
    const {data: templates = []} = useGetShiftTemplates();
    const t = useTranslations();
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
        const classes: string[] = ["flex flex-col flex-1 min-h-0 cursor-pointer select-none transition-all duration-300 active:bg-base-200/50 relative overflow-hidden group"];

        if (isTodayDay) {
            classes.push("bg-primary/[0.03]");
        } else if (holiday) {
            classes.push("bg-error/[0.04]");
        } else if (config.showWeekends && weekend) {
            if (config.weekendHighlight === "background" || config.weekendHighlight === "both") {
                classes.push("bg-base-200/30");
            } else {
                classes.push("bg-base-100");
            }
        } else if (!isCurrentMonth) {
            classes.push("bg-base-200/10 opacity-40");
        } else {
            classes.push("bg-base-100");
        }

        return classes;
    };

    return (
        <div
            onClick={() => onDayClick?.(day, events)}
            className={cn(
                getDayClasses(),
                "border-r border-b border-base-200/50",
                isLastInRow && "border-r-0",
                "w-full min-w-0 box-border"
            )}
        >
            {/* Декоративный индикатор текущего дня */}
            {isTodayDay && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(var(--p),0.5)] z-20" />
            )}

            <div className="relative z-10 flex flex-col h-full p-1 min-h-0 pointer-events-none">
                <div className="flex justify-center items-center h-6 mb-1 shrink-0">
                    <span className={cn(
                        "text-[13px] font-black transition-all flex items-center justify-center min-w-[24px] h-[24px] rounded-full",
                        isTodayDay 
                            ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-110" 
                            : holiday 
                                ? "text-error" 
                                : isCurrentMonth 
                                    ? (weekend && config.showWeekends && (config.weekendHighlight === 'text' || config.weekendHighlight === 'both') ? "text-error/70" : "text-base-content/80")
                                    : "text-base-content/20"
                    )}>
                        {format(day, "d")}
                    </span>
                </div>

                <div className="flex-1 px-0.5 flex flex-col gap-1 overflow-hidden min-h-0 justify-start">
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

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "rounded-[6px] text-[8px] font-black text-center truncate px-1 py-1 flex flex-col justify-center leading-none shadow-sm shrink-0 border-l-2",
                                )}
                                style={{
                                    backgroundColor: cardBackground || color,
                                    backgroundImage: cardBackgroundImage,
                                    color: textColor,
                                    borderLeftColor: color
                                }}
                            >
                                <span className="truncate uppercase tracking-tighter">{label}</span>
                                {time && (
                                    <span className="opacity-70 text-[7px] font-bold mt-0.5">
                                        {formatInTimeZone(new Date(time), tz, TIME_FORMAT)}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {more > 0 && (
                        <div
                            className="text-[8px] font-black text-center text-base-content/40 bg-base-300/30 rounded-lg py-0.5 leading-none shrink-0 border border-base-300/20">
                            +{more}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

import cn from "classnames";
import { useSchedule, getDayNames } from "../context";

export const WeekdaysHeader = () => {
    const { config } = useSchedule();
    const dayNames = getDayNames(config.startOfWeek ?? 1);

    return (
        <div className="grid grid-cols-7 text-center w-full box-border px-0.5 bg-base-100 relative z-10">
            {dayNames.map((day, idx) => {
                const dayIndex = ((config.startOfWeek ?? 1) + idx) % 7;
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                const shouldHighlight = config.showWeekends && isWeekend && 
                    (config.weekendHighlight === 'text' || config.weekendHighlight === 'both');

                return (
                    <div 
                        key={idx} 
                        className={cn(
                            "py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors border-b border-base-300/40",
                            shouldHighlight ? "text-warning" : "text-base-content/45"
                        )}
                    >
                        {day}
                    </div>
                );
            })}
        </div>
    );
};

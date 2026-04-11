import cn from "classnames";
import { useSchedule, getDayNames } from "../context";

export const WeekdaysHeader = () => {
    const { config } = useSchedule();
    const dayNames = getDayNames(config.startOfWeek ?? 1);

    return (
        <div className="grid grid-cols-7 text-center w-full box-border px-0 bg-base-100/50 backdrop-blur-sm sticky top-[68px] z-10 border-b border-base-200/40">
            {dayNames.map((day, idx) => {
                const dayIndex = ((config.startOfWeek ?? 1) + idx) % 7;
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                const shouldHighlight = config.showWeekends && isWeekend && 
                    (config.weekendHighlight === 'text' || config.weekendHighlight === 'both');

                return (
                    <div 
                        key={idx} 
                        className={cn(
                            "py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                            shouldHighlight ? "text-error/70" : "text-base-content/40"
                        )}
                    >
                        {day}
                    </div>
                );
            })}
        </div>
    );
};

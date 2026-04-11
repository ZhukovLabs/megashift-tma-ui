import {format, isSameMonth} from "date-fns";
import {ru} from "date-fns/locale";
import {useSchedule} from "../context";
import cn from "classnames";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const CalendarHeader = () => {
    const {currentDate, nextMonth, prevMonth} = useSchedule();
    const isCurrentMonth = isSameMonth(currentDate, new Date());

    const monthName = format(currentDate, "LLLL", {locale: ru});
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const year = format(currentDate, "yyyy");

    return (
        <div
            className="flex items-center justify-between px-4 py-3 bg-base-100/80 backdrop-blur-md sticky top-0 box-border w-full flex-shrink-0 relative z-20 border-b border-base-200/50">
            <div className="flex flex-col">
                <h1 className="text-xl font-extrabold tracking-tight text-base-content flex items-baseline gap-2">
                    {capitalizedMonth}
                    <span className="text-sm font-medium text-base-content/40">{year}</span>
                </h1>
                {isCurrentMonth && (
                    <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
                        Текущий месяц
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1 bg-base-200/50 p-1 rounded-xl">
                <button
                    onClick={prevMonth}
                    className="btn btn-ghost btn-xs btn-square h-8 w-8 hover:bg-base-100 shadow-sm transition-all active:scale-95"
                    aria-label="Предыдущий месяц"
                >
                    <ChevronLeft size={18} className="text-base-content/70"/>
                </button>

                <button
                    onClick={nextMonth}
                    className="btn btn-ghost btn-xs btn-square h-8 w-8 hover:bg-base-100 shadow-sm transition-all active:scale-95"
                    aria-label="Следующий месяц"
                >
                    <ChevronRight size={18} className="text-base-content/70"/>
                </button>
            </div>
        </div>
    );
};

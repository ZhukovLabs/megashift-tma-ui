import {format, isSameMonth} from "date-fns";
import {ru} from "date-fns/locale";
import {useSchedule} from "../context";
import cn from "classnames";

export const CalendarHeader = () => {
    const {currentDate, nextMonth, prevMonth} = useSchedule();
    const isCurrentMonth = isSameMonth(currentDate, new Date());

    const monthName = format(currentDate, "LLLL", {locale: ru});
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const year = format(currentDate, "yyyy");

    return (
        <div
            className="flex items-center justify-center gap-2 px-1 py-2 bg-base-100 box-border w-full flex-shrink-0 relative z-20">
            <button
                onClick={prevMonth}
                className="btn btn-ghost btn-sm btn-circle min-h-0 h-8 w-8 p-0 hover:bg-base-200"
                aria-label="Предыдущий месяц"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
            </button>

            <div className="flex flex-col items-center w-[125px]">
                <h1 className="text-base font-bold tracking-tight text-base-content">
                    {capitalizedMonth} {year}
                </h1>
                <span
                    className={cn("text-[9px] text-primary font-semibold tracking-wide uppercase",
                        {'opacity-0': !isCurrentMonth}
                    )}>Текущий месяц</span>
            </div>

            <button
                onClick={nextMonth}
                className="btn btn-ghost btn-sm btn-circle min-h-0 h-8 w-8 p-0 hover:bg-base-200"
                aria-label="Следующий месяц"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    );
};

import {format, isSameMonth} from "date-fns";
import {ru} from "date-fns/locale";
import {useSchedule} from "../context";
import cn from "classnames";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";

export const CalendarHeader = () => {
    const {currentDate, nextMonth, prevMonth} = useSchedule();
    const isCurrentMonth = isSameMonth(currentDate, new Date());
    const t = useTranslations();

    const monthNames = [
        t('months.january'), t('months.february'), t('months.march'),
        t('months.april'), t('months.may'), t('months.june'),
        t('months.july'), t('months.august'), t('months.september'),
        t('months.october'), t('months.november'), t('months.december')
    ];

    const monthName = monthNames[currentDate.getMonth()];
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const year = format(currentDate, "yyyy");

    return (
        <div
            className="flex items-center justify-center px-4 py-3 bg-base-100/80 backdrop-blur-md sticky top-0 box-border w-full flex-shrink-0 relative z-20 border-b border-base-200/50 gap-4">
            
            <button
                onClick={prevMonth}
                className="btn btn-ghost btn-sm btn-square h-10 w-10 hover:bg-base-200/50 transition-all active:scale-90 shrink-0"
                aria-label={t('calendar.prevMonth')}
            >
                <ChevronLeft size={24} className="text-base-content/30"/>
            </button>

            <div className="flex flex-col items-center justify-center min-w-0">
                <h1 className="text-lg font-black tracking-tight text-base-content flex items-center gap-1.5 leading-none">
                    <span className="truncate">{capitalizedMonth}</span>
                    <span className="text-xs font-bold text-base-content/15">{year}</span>
                </h1>
                {isCurrentMonth && (
                    <span className="text-[9px] text-primary font-black tracking-[0.1em] uppercase mt-1 leading-none">
                        {t('calendar.currentMonth')}
                    </span>
                )}
            </div>

            <button
                onClick={nextMonth}
                className="btn btn-ghost btn-sm btn-square h-10 w-10 hover:bg-base-200/50 transition-all active:scale-90 shrink-0"
                aria-label={t('calendar.nextMonth')}
            >
                <ChevronRight size={24} className="text-base-content/30"/>
            </button>
        </div>
    );
};

import {format, isSameYear} from "date-fns";
import {ru} from "date-fns/locale";

type CalendarHeaderProps = {
    currentDate: Date;
}

export const CalendarHeader = ({currentDate}: CalendarHeaderProps) => {
    const isCurrentYear = isSameYear(currentDate, new Date());

    const monthName = format(currentDate, "LLLL", {locale: ru});
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const year = format(currentDate, "yyyy");

    const displayText = isCurrentYear
        ? capitalizedMonth
        : `${capitalizedMonth} ${year}`;

    return (
        <div className="flex items-center justify-center mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {displayText}
            </h1>
        </div>
    );
}
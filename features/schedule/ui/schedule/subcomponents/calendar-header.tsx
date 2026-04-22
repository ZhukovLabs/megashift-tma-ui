import {format, isSameYear} from "date-fns";
import {useTranslation} from "react-i18next";

type CalendarHeaderProps = {
    currentDate: Date;
}

export const CalendarHeader = ({currentDate}: CalendarHeaderProps) => {
    const {t, i18n} = useTranslation();
    const isCurrentYear = isSameYear(currentDate, new Date());

    const monthNames = [
        t('months.january'), t('months.february'), t('months.march'),
        t('months.april'), t('months.may'), t('months.june'),
        t('months.july'), t('months.august'), t('months.september'),
        t('months.october'), t('months.november'), t('months.december')
    ];

    const monthName = monthNames[currentDate.getMonth()];
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

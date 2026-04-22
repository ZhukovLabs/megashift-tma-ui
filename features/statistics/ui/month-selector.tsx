'use client';

import {useTranslations} from 'next-intl';

type MonthSelectorProps = {
    year: number;
    month: number;
    onChange: (year: number, month: number) => void;
    minYear?: number;
    maxYear?: number;
    yearPlaceholder?: string;
};

export function MonthSelector({
                                   year,
                                   month,
                                   onChange,
                                   minYear = 1900,
                                   maxYear = 2200,
                                   yearPlaceholder,
                               }: MonthSelectorProps) {
    const t = useTranslations();
    const handleYearChange = (value: number) => {
        onChange(value, month);
    };

    const handleMonthChange = (value: number) => {
        onChange(year, value);
    };

    return (
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
            <input
                type="number"
                value={year}
                min={minYear}
                max={maxYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="input input-bordered w-32 mb-3"
                placeholder={yearPlaceholder || t('statistics.yearPlaceholder')}
            />

            <select
                value={month}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="select select-bordered w-32"
            >
                {Array.from({ length: 12 }, (_, i) => {
                    const monthNames = [
                        t('months.january'), t('months.february'), t('months.march'),
                        t('months.april'), t('months.may'), t('months.june'),
                        t('months.july'), t('months.august'), t('months.september'),
                        t('months.october'), t('months.november'), t('months.december')
                    ];
                    return (
                        <option key={i + 1} value={i + 1}>
                            {monthNames[i]}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
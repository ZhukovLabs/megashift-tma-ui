'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

type MonthSelectorProps = {
    year: number;
    month: number;
    onChange: (year: number, month: number) => void;
    minYear?: number;
    maxYear?: number;
};

export function MonthSelector({
                                  year,
                                  month,
                                  onChange,
                                  minYear = 1900,
                                  maxYear = 2200,
                              }: MonthSelectorProps) {
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
                placeholder="Год"
            />

            <select
                value={month}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="select select-bordered w-32"
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {format(new Date(2020, i, 1), 'LLLL', { locale: ru })}
                    </option>
                ))}
            </select>
        </div>
    );
}
'use client';

import {SalaryProgress} from './ui/salary-progress';
import {StatisticsTable} from './ui/statistics-table';
import {MonthSelector} from './ui/month-selector';
import {MonthSwitcher} from './ui/month-switcher';
import {useStatisticsData} from './model/use-statistics-data';
import {useStatisticsDate} from "./model/use-statistics-date";
import {formatNumberRU} from '@/shared/lib/format/format-number';
import {getCurrencySymbol} from "@/entities/currency";
import {useUserStore} from "@/entities/user/model/store";

export function StatisticsPage() {
    const {year, month, next, prev, set} = useStatisticsDate();
    const currency = useUserStore(s => s.user?.currency);
    const currencySymbol = getCurrencySymbol(currency);


    const {shiftCount, shiftHours, salary} = useStatisticsData(year, month);

    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100 px-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-5">
                Статистика
            </h1>

            <MonthSelector
                year={year}
                month={month}
                onChange={set}
            />

            <MonthSwitcher
                year={year}
                month={month}
                onNext={next}
                onPrev={prev}
            >
                <StatisticsTable
                    data={shiftCount.items}
                    isLoading={shiftCount.isLoading}
                    formatNumber={formatNumberRU}
                />
                <StatisticsTable
                    data={shiftHours.items}
                    isLoading={shiftHours.isLoading}
                    formatNumber={formatNumberRU}
                />
                <SalaryProgress
                    typeSalary={salary.typeSalary}
                    salary={salary.salary}
                    maxSalary={salary.maxSalary}
                    currencySymbol={currencySymbol?.symbol}
                    isLoading={salary.isLoading}
                />
            </MonthSwitcher>
        </div>
    );
}
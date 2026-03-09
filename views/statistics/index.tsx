'use client';

import {useTranslations} from 'next-intl';
import {
    MonthSelector,
    MonthSwitcher,
    StatisticsTable,
    SalaryProgress,
    useStatisticsDate,
    useStatisticsData
} from '@/features/statistics';
import {formatNumberRU} from '@/shared/lib/format/format-number';
import {getCurrencySymbol} from '@/entities/currency';
import {useUserStore} from '@/entities/user/model/store';
import {StatisticsSkeleton} from '@/features/statistics/ui/skeleton';

export function StatisticsPage() {
    const t = useTranslations('statistics');
    const {year, month, next, prev, set} = useStatisticsDate();
    const currency = useUserStore(s => s.user?.currency);
    const currencySymbol = getCurrencySymbol(currency);

    const {isLoading, shiftCount, shiftHours, salary} = useStatisticsData(year, month);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center bg-base-100 px-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-5">
                    {t('title')}
                </h1>
                <MonthSelector
                    year={year}
                    month={month}
                    onChange={set}
                    yearPlaceholder={t('yearPlaceholder')}
                />
                <StatisticsSkeleton/>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100 px-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-5">
                {t('title')}
            </h1>

            <MonthSelector
                year={year}
                month={month}
                onChange={set}
                yearPlaceholder={t('yearPlaceholder')}
            />

            <MonthSwitcher
                year={year}
                month={month}
                onNext={next}
                onPrev={prev}
            >
                <StatisticsTable
                    data={shiftCount.items}
                    formatNumber={formatNumberRU}
                    totalLabel={t('total')}
                    noDataMessage={t('noData')}
                />
                <StatisticsTable
                    data={shiftHours.items}
                    formatNumber={formatNumberRU}
                    totalLabel={t('total')}
                    noDataMessage={t('noData')}
                />
                <SalaryProgress
                    typeSalary={salary.typeSalary}
                    salary={salary.salary}
                    maxSalary={salary.maxSalary}
                    currencySymbol={currencySymbol?.symbol}
                    salaryTypeLabel={t(`salaryTypes.${salary.typeSalary}`)}
                />
            </MonthSwitcher>
        </div>
    );
}

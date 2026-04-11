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
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl font-black tracking-tight text-center mb-6 mt-2">
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
        <div className="flex flex-col items-center w-full">
            <h1 className="text-3xl font-black tracking-tight text-center mb-8 mt-2">
                {t('title')}
            </h1>

            <div className="w-full mb-6">
                <MonthSelector
                    year={year}
                    month={month}
                    onChange={set}
                    yearPlaceholder={t('yearPlaceholder')}
                />
            </div>

            <MonthSwitcher
                year={year}
                month={month}
                onNext={next}
                onPrev={prev}
            >
                <div className="space-y-6 w-full">
                    <div className="bg-base-200/30 rounded-[24px] p-1">
                        <StatisticsTable
                            data={shiftCount.items}
                            formatNumber={formatNumberRU}
                            totalLabel={t('total')}
                            noDataMessage={t('noData')}
                        />
                    </div>
                    
                    <div className="bg-base-200/30 rounded-[24px] p-1">
                        <StatisticsTable
                            data={shiftHours.items}
                            formatNumber={formatNumberRU}
                            totalLabel={t('total')}
                            noDataMessage={t('noData')}
                        />
                    </div>

                    <div className="bg-primary/5 rounded-[32px] p-6 border border-primary/10">
                        <SalaryProgress
                            typeSalary={salary.typeSalary}
                            salary={salary.salary}
                            maxSalary={salary.maxSalary}
                            currencySymbol={currencySymbol?.symbol}
                            salaryTypeLabel={t(`salaryTypes.${salary.typeSalary}`)}
                        />
                    </div>
                </div>
            </MonthSwitcher>
        </div>
    );
}

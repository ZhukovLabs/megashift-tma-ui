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
import {motion} from 'framer-motion';

export function StatisticsPage() {
    const t = useTranslations('statistics');
    const {year, month, next, prev, set} = useStatisticsDate();
    const currency = useUserStore(s => s.user?.currency);
    const currencySymbol = getCurrencySymbol(currency);

    const {isLoading, shiftCount, shiftHours, salary} = useStatisticsData(year, month);

    const header = (
        <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm">
            <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                    {t('title')}
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/20 mt-1.5 leading-none">
                    {t('subtitle')}
                </p>
            </div>
        </header>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full min-h-full">
                {header}
                <div className="px-4 py-6 w-full max-w-xl mx-auto">
                    <MonthSelector
                        year={year}
                        month={month}
                        onChange={set}
                        yearPlaceholder={t('yearPlaceholder')}
                    />
                    <StatisticsSkeleton/>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            {header}

            <main className="w-full px-4 max-w-xl mx-auto space-y-6 pt-6 pb-32">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    <MonthSelector
                        year={year}
                        month={month}
                        onChange={set}
                        yearPlaceholder={t('yearPlaceholder')}
                    />
                </motion.div>

                <MonthSwitcher
                    year={year}
                    month={month}
                    onNext={next}
                    onPrev={prev}
                >
                    <div className="space-y-6 w-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-base-100 rounded-[32px] p-2 border border-base-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                            <StatisticsTable
                                data={shiftCount.items}
                                formatNumber={formatNumberRU}
                                totalLabel={t('total')}
                                noDataMessage={t('noData')}
                            />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-base-100 rounded-[32px] p-2 border border-base-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                            <StatisticsTable
                                data={shiftHours.items}
                                formatNumber={formatNumberRU}
                                totalLabel={t('total')}
                                noDataMessage={t('noData')}
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-primary/[0.03] rounded-[40px] p-8 border border-primary/10"
                        >
                            <SalaryProgress
                                typeSalary={salary.typeSalary}
                                salary={salary.salary}
                                maxSalary={salary.maxSalary}
                                currencySymbol={currencySymbol?.symbol}
                                salaryTypeLabel={t(`salaryTypes.${salary.typeSalary}`)}
                            />
                        </motion.div>
                    </div>
                </MonthSwitcher>
            </main>
        </div>
    );
}

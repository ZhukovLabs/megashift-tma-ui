'use client';

import {useState} from 'react';
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
import {ModalSheet} from '@/shared/ui/modal-sheet';
import {ShieldCheck, Check, Filter} from 'lucide-react';
import cn from 'classnames';

const BLOCK_IDS = {
    SHIFT_COUNT: 'shift_count',
    SHIFT_HOURS: 'shift_hours',
} as const;

function BlockSettingsModal({
    isOpen,
    onClose,
    title,
    items,
    excludedIds,
    onToggle
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: Array<{id: string; label: string; color?: string; isExcluded?: boolean}>;
    excludedIds: Set<string>;
    onToggle: (id: string) => void;
}) {
    return (
        <ModalSheet 
            isOpen={isOpen} 
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Filter size={20} strokeWidth={2.5} />
                    </div>
                    <span>{title}</span>
                </div>
            }
        >
            <div className="space-y-6">
                <p className="text-sm font-medium text-base-content/40 leading-relaxed">
                    Выберите шаблоны смен, которые должны участвовать в расчете.
                </p>
                
                <div className="space-y-3 pb-8">
                    {items.map((item) => {
                        const isExcluded = excludedIds.has(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onToggle(item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-5 rounded-[24px] border-2 transition-all active:scale-[0.98]",
                                    isExcluded 
                                        ? "bg-base-200/20 border-transparent text-base-content/30" 
                                        : "bg-base-100 border-base-200/60 text-base-content hover:border-primary/20"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                        style={{ 
                                            backgroundColor: isExcluded ? "transparent" : `${item.color}15`, 
                                            color: isExcluded ? "currentColor" : item.color 
                                        }}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: isExcluded ? "currentColor" : item.color}} />
                                    </div>
                                    <span className="font-bold text-base tracking-tight">{item.label}</span>
                                </div>
                                
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                    isExcluded ? "bg-base-300/50 text-base-content/10" : "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                )}>
                                    {!isExcluded && <Check size={14} strokeWidth={4} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </ModalSheet>
    );
}

export function StatisticsPage() {
    const t = useTranslations('statistics');
    const {year, month, next, prev, set} = useStatisticsDate();
    const currency = useUserStore(s => s.user?.currency);
    const currencySymbol = getCurrencySymbol(currency);

    const {isLoading, useBlockStatistics, salary} = useStatisticsData(year, month);
    
    const countBlock = useBlockStatistics(BLOCK_IDS.SHIFT_COUNT);
    const hoursBlock = useBlockStatistics(BLOCK_IDS.SHIFT_HOURS);

    const [settingsBlockId, setSettingsBlockId] = useState<string | null>(null);

    const openSettings = (blockId: string) => setSettingsBlockId(blockId);
    const closeSettings = () => setSettingsBlockId(null);

    const currentSettingsBlock = settingsBlockId === BLOCK_IDS.SHIFT_COUNT 
        ? countBlock 
        : settingsBlockId === BLOCK_IDS.SHIFT_HOURS 
            ? hoursBlock 
            : null;

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
                            className="bg-base-100 rounded-[32px] border border-base-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
                        >
                            <StatisticsTable
                                title={t('totalShifts')}
                                data={countBlock.itemsCount.items}
                                formatNumber={formatNumberRU}
                                totalLabel={t('total')}
                                noDataMessage={t('noData')}
                                onToggleExclude={countBlock.toggleExclude}
                                onOpenSettings={() => openSettings(BLOCK_IDS.SHIFT_COUNT)}
                            />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-base-100 rounded-[32px] border border-base-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
                        >
                            <StatisticsTable
                                title={t('totalHours')}
                                data={hoursBlock.itemsHours.items}
                                formatNumber={formatNumberRU}
                                totalLabel={t('total')}
                                noDataMessage={t('noData')}
                                onToggleExclude={hoursBlock.toggleExclude}
                                onOpenSettings={() => openSettings(BLOCK_IDS.SHIFT_HOURS)}
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-primary/[0.03] rounded-[40px] p-8 border border-primary/10 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 right-4 text-primary/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                <ShieldCheck size={48} strokeWidth={2.5}/>
                            </div>
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

            <BlockSettingsModal
                isOpen={settingsBlockId === BLOCK_IDS.SHIFT_COUNT}
                onClose={closeSettings}
                title={t('totalShifts')}
                items={countBlock.itemsCount.items}
                excludedIds={countBlock.excludedIds}
                onToggle={countBlock.toggleExclude}
            />

            <BlockSettingsModal
                isOpen={settingsBlockId === BLOCK_IDS.SHIFT_HOURS}
                onClose={closeSettings}
                title={t('totalHours')}
                items={hoursBlock.itemsHours.items}
                excludedIds={hoursBlock.excludedIds}
                onToggle={hoursBlock.toggleExclude}
            />
        </div>
    );
}
import type {ReactNode} from "react";
import {calculatePercentage} from "@/features/statistics/model/calculate-percentage";
import {StatisticsRow} from "./statistics-row";
import {LoaderLarge} from "@/shared/ui/loader-large";
import {Settings2} from "lucide-react";

export type StatisticItem = {
    id: string;
    label: string;
    value: number;
    color?: string;
    isExcluded?: boolean;
};

type BaseStatisticsTableProps<T extends StatisticItem> = {
    data: T[] | undefined;
    isLoading?: boolean;
    totalLabel?: string;
    noDataMessage?: string;
    formatNumber?: (n: number) => string;
    renderItem?: (item: T, percentage: number) => ReactNode;
    onToggleExclude?: (id: string) => void;
    onOpenSettings?: () => void;
    title?: string;
};

export const StatisticsTable = <T extends StatisticItem>({
                                                                 data,
                                                                 isLoading = false,
                                                                 totalLabel = 'Всего',
                                                                 noDataMessage = 'Нет данных',
                                                                 formatNumber = (n) => n.toLocaleString(),
                                                                 renderItem,
                                                                 onToggleExclude,
                                                                 onOpenSettings,
                                                                 title
                                                             }: BaseStatisticsTableProps<T>) => {
    if (isLoading) {
        return <LoaderLarge/>
    }

    // Показываем только НЕ исключенные элементы
    const activeData = data?.filter(item => !item.isExcluded) || [];
    const hasActiveData = activeData.length > 0;

    return (
        <div className="w-full flex flex-col">
            {(title || onOpenSettings) && (
                <div className="flex items-center justify-between px-6 pt-5 pb-2">
                    {title && (
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/25 leading-none">
                            {title}
                        </h3>
                    )}
                    {onOpenSettings && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenSettings();
                            }}
                            className="w-8 h-8 rounded-xl bg-base-200/50 flex items-center justify-center text-base-content/30 active:scale-90 active:bg-primary/10 active:text-primary transition-all group"
                        >
                            <Settings2 size={16} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            )}

            {!hasActiveData ? (
                <div className="text-center py-12 px-6 flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-base-content/30">{noDataMessage}</span>
                    {onOpenSettings && (
                        <button 
                            onClick={onOpenSettings}
                            className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                        >
                            Изменить фильтр
                        </button>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-md mx-auto p-4 pt-2">
                    <div className="flex flex-col gap-2.5">
                        {activeData
                            .sort((a, b) => b.value - a.value)
                            .map((item) => {
                                const totalValue = activeData.reduce((acc, i) => acc + i.value, 0);
                                const pct = calculatePercentage(item.value, totalValue);

                                return renderItem ? renderItem(item, pct) :
                                    <StatisticsRow 
                                        key={item.id} 
                                        item={item} 
                                        total={totalValue} 
                                        formatNumber={formatNumber}
                                        // Клик в самой таблице убран, теперь только через настройки
                                        onToggle={undefined} 
                                    />;
                            })}
                        
                        <div className="mt-4 flex justify-end">
                            <div className="px-5 py-2 rounded-2xl bg-base-200/40 border border-base-200/60 backdrop-blur-sm shadow-sm transition-all hover:border-primary/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/25 mr-2">
                                    {totalLabel}:
                                </span>
                                <span className="text-sm font-black text-base-content/80 tabular-nums">
                                    {formatNumber(activeData.reduce((acc, item) => acc + item.value, 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

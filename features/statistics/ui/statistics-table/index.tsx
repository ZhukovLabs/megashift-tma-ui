import type {ReactNode} from "react";
import {calculatePercentage} from "@/features/statistics/model/calculate-percentage";
import {StatisticsRow} from "./statistics-row";
import {LoaderLarge} from "@/shared/ui/loader-large";

export type StatisticItem = {
    id: string;
    label: string;
    value: number;
    color?: string;
};

type BaseStatisticsTableProps<T extends StatisticItem> = {
    data: T[] | undefined;
    isLoading?: boolean;
    totalLabel?: string;
    noDataMessage?: string;
    formatNumber?: (n: number) => string;
    renderItem?: (item: T, percentage: number) => ReactNode;
};

export const StatisticsTable = <T extends StatisticItem>({
                                                                 data,
                                                                 isLoading = false,
                                                                 totalLabel = 'Всего',
                                                                 noDataMessage = 'Нет данных',
                                                                 formatNumber = (n) => n.toLocaleString(),
                                                                 renderItem,
                                                             }: BaseStatisticsTableProps<T>) => {
    if (isLoading) {
        return <LoaderLarge/>
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-4 text-sm text-base-content/50">{noDataMessage}</div>;
    }

    const totalValue = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex flex-col gap-2">
                {data?.slice()
                    .sort((a, b) => b.value - a.value)
                    .map((item) => {
                        const pct = calculatePercentage(item.value, totalValue);

                        return renderItem ? renderItem(item, pct) :
                            <StatisticsRow key={item.id} item={item} total={totalValue} formatNumber={formatNumber}/>;
                    })}
                <div className="mt-3 flex justify-end">
                            <span
                                className="px-4 py-1.5 rounded-full bg-primary text-primary-content font-semibold text-sm">
                                {totalLabel}: {formatNumber(totalValue)}
                            </span>
                </div>
            </div>
        </div>
    );
};

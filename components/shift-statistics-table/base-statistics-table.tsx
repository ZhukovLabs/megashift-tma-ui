import {useMemo} from "react";

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
    renderItem?: (item: T, percentage: number) => React.ReactNode;
};

export const BaseStatisticsTable = <T extends StatisticItem>({
                                                             data,
                                                             isLoading = false,
                                                             totalLabel = 'Всего',
                                                             noDataMessage = 'Нет данных',
                                                             formatNumber = (n) => n.toLocaleString(),
                                                             renderItem,
                                                         }: BaseStatisticsTableProps<T>) => {
    const totalValue = useMemo(() => data?.reduce((acc, item) => acc + item.value, 0) ?? 0, [data]);

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex flex-col gap-2">
                {isLoading ? (
                    <div className="text-center text-base-content/70 py-6">Загрузка...</div>
                ) : data && data.length > 0 ? (
                    <>
                        {data
                            .slice()
                            .sort((a, b) => b.value - a.value)
                            .map((item) => {
                                const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                                return renderItem ? renderItem(item, pct) : (
                                    <div
                                        key={item.id}
                                        className="relative overflow-hidden rounded-lg bg-base-100 border border-base-200"
                                    >
                                        {item.color && (
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-1"
                                                style={{backgroundColor: item.color}}
                                                aria-hidden
                                            />
                                        )}
                                        <div className="flex items-center justify-between gap-3 p-3 pl-6">
                                            <div className="flex flex-col flex-1">
                                                <span className="font-medium">{item.label}</span>
                                                <div className="mt-1.5 h-1.5 bg-base-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: item.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="px-3 py-0.5 rounded-full bg-base-200 font-semibold text-sm">
                                                {formatNumber(item.value)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        <div className="mt-3 flex justify-end">
                            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-content font-semibold text-sm">
                                {totalLabel}: {formatNumber(totalValue)}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-base-content/70 py-8">
                        {noDataMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

import {BaseStatisticsTable, StatisticItem} from './base-statistics-table';
import {useGetShiftStatisticsHours} from '@/api-hooks/statistics/use-get-shift-statistics-hours';

type ShiftHoursStatisticsTableProps = {
    year: number;
    month: number;
};

export const ShiftHoursStatisticsTable = ({year, month}: ShiftHoursStatisticsTableProps) => {
    const {data: stats, isLoading} = useGetShiftStatisticsHours(year, month);

    const items: StatisticItem[] | undefined = stats?.map((s) => ({
        id: s.id,
        label: s.shiftName,
        value: s.hours,
        color: s.color,
    }));

    const nf = new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2});

    return (
        <BaseStatisticsTable
            data={items}
            isLoading={isLoading}
            totalLabel="Всего часов"
            noDataMessage={`Нет данных за ${new Date(year, month - 1).toLocaleString('ru', {month: 'long'})} ${year}`}
            formatNumber={(n) => nf.format(n)}
            renderItem={(item, pct) => (
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
                            {nf.format(item.value)} ч.
                        </span>
                    </div>
                </div>
            )}
        />
    );
};

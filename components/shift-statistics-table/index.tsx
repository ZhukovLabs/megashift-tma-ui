import {useGetShiftStatistics} from '@/api-hooks/use-get-shift-statistics';
import {useMemo} from "react";

type ShiftItem = {
    id: string;
    shiftName: string;
    count: number;
    color: string;
};

type ShiftStatisticsTableProps = {
    year: number;
    month: number;
};

export const ShiftStatisticsTable = ({year, month}: ShiftStatisticsTableProps) => {
    const {data: stats, isLoading} = useGetShiftStatistics(year, month);

    const totalShifts = useMemo(() => stats?.reduce((acc, s) => acc + s.count, 0) ?? 0, [stats]);
    const nf = Intl.NumberFormat('ru-RU');

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex flex-col gap-2">
                {isLoading ? (
                    <div className="text-center text-base-content/70 py-6">Загрузка...</div>
                ) : stats && stats.length > 0 ? (
                    <>
                        {stats
                            .slice()
                            .sort((a, b) => b.count - a.count)
                            .map((s: ShiftItem) => {
                                const pct = totalShifts > 0 ? (s.count / totalShifts) * 100 : 0;

                                return (
                                    <div
                                        key={s.id}
                                        className="relative overflow-hidden rounded-lg bg-base-100 border border-base-200"
                                    >
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1"
                                            style={{backgroundColor: s.color}}
                                            aria-hidden
                                        />
                                        <div className="flex items-center justify-between gap-3 p-3 pl-6">
                                            <div className="flex flex-col flex-1">
                                                <span className="font-medium">{s.shiftName}</span>
                                                <div className="mt-1.5 h-1.5 bg-base-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: s.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span
                                                className="px-3 py-0.5 rounded-full bg-base-200 font-semibold text-sm">
                                                {nf.format(s.count)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                        <div className="mt-3 flex justify-end">
                            <span
                                className="px-4 py-1.5 rounded-full bg-primary text-primary-content font-semibold text-sm">
                                Всего: {nf.format(totalShifts)}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-base-content/70 py-8">
                        Нет данных за {new Date(year, month - 1).toLocaleString('ru', {month: 'long'})} {year}
                    </div>
                )}
            </div>
        </div>
    );
};
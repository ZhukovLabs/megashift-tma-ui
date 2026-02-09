import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type ShiftStatisticsItem = {
    id: string;
    shiftName: string;
    count: number;
    color: string;
};

export const useGetShiftStatistics = (year: number, month: number) => {
    return useQuery<ShiftStatisticsItem[], Error>({
        queryKey: ['shift-statistics', year, month],
        queryFn: async () => {
            const {data} = await api.get<ShiftStatisticsItem[]>(
                '/api/statistics/shifts',
                {params: {year, month}}
            );

            return data;
        },
        enabled: Boolean(year && month),
    });
};

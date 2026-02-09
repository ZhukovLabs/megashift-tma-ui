import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type ShiftStatisticsItem = {
    id: string;
    shiftName: string;
    hours: number;
    color: string;
};

export const useGetShiftStatisticsHours = (year: number, month: number) => {
    return useQuery<ShiftStatisticsItem[], Error>({
        queryKey: ['shift-statistics-hours', year, month],
        queryFn: async () => {
            const {data} = await api.get<ShiftStatisticsItem[]>(
                '/api/statistics/shifts/hours',
                {params: {year, month}}
            );

            return data;
        },
        enabled: Boolean(year && month),
    });
};

import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";

export type ShiftStatisticsItem = {
    id: string;
    shiftName: string;
    count: number;
    color: string;
};

const shiftStatisticsKey = (year: number, month: number) => ['shift-statistics', year, month] as const;

export const useGetShiftStatistics = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<ShiftStatisticsItem[], Error>({
        queryKey: shiftStatisticsKey(year, month),
        queryFn: async () => {
            const {data} = await api.get<ShiftStatisticsItem[]>(
                '/api/statistics/shifts',
                {params: {year, month, ownerId}}
            );

            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};

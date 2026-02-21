import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useOwnerId } from "@/hooks/use-owner-id";

export type ShiftStatisticsCountItem = {
    id: string;
    shiftName: string;
    count: number;
    color: string;
};

const shiftStatisticsKey = (year: number, month: number) =>
    ['shift-statistics', year, month] as const;

export const useGetShiftStatisticsCount = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<ShiftStatisticsCountItem[], Error>({
        queryKey: shiftStatisticsKey(year, month),
        queryFn: async ({ signal }) => {
            const { data } = await api.get<ShiftStatisticsCountItem[]>(
                '/api/statistics/shifts',
                {
                    params: { year, month, ownerId },
                    signal,
                }
            );
            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};
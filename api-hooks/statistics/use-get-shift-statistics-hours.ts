import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";

export type ShiftStatisticsItem = {
    id: string;
    shiftName: string;
    hours: number;
    color: string;
};

const shiftStatisticsHoursKey = (year: number, month: number) => ['shift-statistics-hours', year, month] as const;

export const useGetShiftStatisticsHours = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<ShiftStatisticsItem[], Error>({
        queryKey: shiftStatisticsHoursKey(year, month),
        queryFn: async () => {
            const {data} = await api.get<ShiftStatisticsItem[]>(
                '/api/statistics/shifts/hours',
                {params: {year, month, ownerId}}
            );

            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};

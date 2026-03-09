import {useQuery} from '@tanstack/react-query';
import {api} from '@/shared/config/axios';
import {useOwnerId} from "@/entities/user";
import {ENDPOINTS} from "@/shared/config/api";

export type ShiftStatisticsHoursItem = {
    id: string;
    shiftName: string;
    hours: number;
    color: string;
};

const shiftStatisticsHoursKey = (year: number, month: number) =>
    ['shift-statistics-hours', year, month] as const;

export const useGetShiftStatisticsHours = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<ShiftStatisticsHoursItem[], Error>({
        queryKey: shiftStatisticsHoursKey(year, month),
        queryFn: async ({signal}) => {
            const {data} = await api.get<ShiftStatisticsHoursItem[]>(
                ENDPOINTS.getShiftStatisticHours,
                {
                    params: {year, month, ownerId},
                    signal,
                }
            );

            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};
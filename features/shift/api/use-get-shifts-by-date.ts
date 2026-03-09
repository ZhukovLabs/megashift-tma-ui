import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { useOwnerId } from '@/entities/user';
import { ENDPOINTS } from '@/shared/config/api';
import type { ShiftDto } from '@/features/shift/model';

type GetShiftsByDayParams = {
    date: string;
};

type GetShiftsByDayResponse = ShiftDto[];

const shiftsByDateKey = () => ['shifts-by-date'] as const;

export const useGetShiftsByDate = ({ date }: GetShiftsByDayParams) => {
    const ownerId = useOwnerId();

    return useQuery<GetShiftsByDayResponse>({
        queryKey: shiftsByDateKey(),
        queryFn: async () => {
            const { data } = await api.get<GetShiftsByDayResponse>(ENDPOINTS.getShiftsByDate, {
                params: { date, ownerId },
            });
            return data;
        },
        enabled: !!date && /^\d{4}-\d{2}-\d{2}$/.test(date),
    });
};

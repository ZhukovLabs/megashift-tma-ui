import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type ShiftDto = {
    id: string;
    date: string;
    actualStartTime: string | null;
    actualEndTime: string | null;
    shiftTemplateId: string | null;
};

type GetShiftsByDayParams = {
    date: string;
};

type GetShiftsByDayResponse = ShiftDto[];

const shiftsByDateKey = () => ['shifts-by-date'] as const;

export const useGetShiftsByDate = ({date}: GetShiftsByDayParams) => {
    return useQuery<GetShiftsByDayResponse>({
        queryKey: shiftsByDateKey(),
        queryFn: async () => {
            const {data} = await api.get<GetShiftsByDayResponse>('/api/shifts/date', {
                params: {date},
            });
            return data;
        },
        enabled: !!date && /^\d{4}-\d{2}-\d{2}$/.test(date),
    });
};

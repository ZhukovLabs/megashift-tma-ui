import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";
import {ENDPOINTS} from "@/shared/config/api";

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
    const ownerId = useOwnerId();

    return useQuery<GetShiftsByDayResponse>({
        queryKey: shiftsByDateKey(),
        queryFn: async () => {
            const {data} = await api.get<GetShiftsByDayResponse>(ENDPOINTS.getShiftsByDate, {
                params: {date, ownerId},
            });
            return data;
        },
        enabled: !!date && /^\d{4}-\d{2}-\d{2}$/.test(date),
    });
};

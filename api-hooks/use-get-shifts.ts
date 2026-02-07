import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type ShiftDto = {
    id: string;
    date: string;
    actualStartTime: string | null;
    actualEndTime: string | null;
    shiftTemplateId: string | null;
};

type GetShiftsParams = {
    year: number;
    month: number;
};

type GetShiftsResponse = ShiftDto[];
export const useGetShifts = ({year, month}: GetShiftsParams) => {
    return useQuery<GetShiftsResponse>({
        queryKey: ['shifts', year, month],
        queryFn: async () => {
            const {data} = await api.get<GetShiftsResponse>('/api/shifts', {
                params: {year, month},
            });
            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};
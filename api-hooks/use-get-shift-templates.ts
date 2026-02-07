import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

type GetShiftTemplatesResponse = Array<{
    id: string;
    label: string;
    color: string;
    startTime: string;
    endTime: string;
}>

export const useGetShiftTemplates = () => {
    return useQuery<GetShiftTemplatesResponse, void>({
        queryKey: ['shift-templates'],
        queryFn: async () => {
            const {data} = await api.get<GetShiftTemplatesResponse>('/api/shift-templates');
            return data;
        },
    });
};
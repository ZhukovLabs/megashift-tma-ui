import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";
import {ENDPOINTS} from "@/shared/config/api";

type GetShiftTemplatesResponse = Array<{
    id: string;
    label: string;
    color: string;
    startTime: string;
    endTime: string;
}>

const shiftTemplatesKey = () => ['shift-templates'] as const;

export const useGetShiftTemplates = () => {
    const ownerId = useOwnerId();

    return useQuery<GetShiftTemplatesResponse, void>({
        queryKey: shiftTemplatesKey(),
        queryFn: async () => {
            const {data} = await api.get<GetShiftTemplatesResponse>(ENDPOINTS.getShiftTemplates, {
                params: {ownerId}
            });
            return data;
        },
    });
};

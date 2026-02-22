import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {useOwnerId} from "@/hooks/use-owner-id";
import {ENDPOINTS} from "@/shared/config/api";

type ShiftTemplateResponse = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

export const useGetShiftTemplate = (id: string) => {
    const ownerId = useOwnerId();

    return useQuery({
        queryKey: ["shift-template", id],
        queryFn: async () => {
            const response = await api.get<ShiftTemplateResponse>(
                ENDPOINTS.getShiftTemplateById(id),
                {params: {ownerId}}
            );
            return response.data;
        },
        enabled: Boolean(id),
    });
};

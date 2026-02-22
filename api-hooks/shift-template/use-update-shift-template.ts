import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {useOwnerId} from "@/hooks/use-owner-id";
import {ENDPOINTS} from "@/shared/config/api";

type UpdateShiftTemplateRequest = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

type ShiftTemplateResponse = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

export const useUpdateShiftTemplate = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<
        ShiftTemplateResponse,
        Error,
        UpdateShiftTemplateRequest
    >({
        mutationFn: async ({id, ...data}) => {
            const response = await api.patch<ShiftTemplateResponse>(
                ENDPOINTS.updateShiftTemplate(id),
                data,
                {params: {ownerId}}
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shift-templates"]});
        },
    });
};

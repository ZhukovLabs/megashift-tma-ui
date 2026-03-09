import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/shared/config/axios';
import {useOwnerId} from "@/entities/user";
import { ENDPOINTS } from '@/shared/config/api';

type CreateShiftTemplateRequest = {
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
}

type ShiftTemplateResponse = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

export const useCreateShiftTemplate = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<
        ShiftTemplateResponse,
        Error,
        CreateShiftTemplateRequest
    >({
        mutationFn: async (data) => {
            const response = await api.post<ShiftTemplateResponse>(
                ENDPOINTS.createShiftTemplates,
                data,
                {params: {ownerId}}
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shift-templates']});
        },
    });
};

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';

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
    const queryClient = useQueryClient();

    return useMutation<
        ShiftTemplateResponse,
        Error,
        CreateShiftTemplateRequest
    >({
        mutationFn: async (data) => {
            const response = await api.post<ShiftTemplateResponse>(
                '/api/shift-templates',
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shift-templates']});
        },
    });
};

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type CreateShiftPayload = {
    date: string;
    shiftTemplateId: string;
};

export const useCreateShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        CreateShiftPayload
    >({
        mutationFn: async (payload) => {
            await api.post('/api/shifts', payload);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['shifts'],
            });
        },
    });
};


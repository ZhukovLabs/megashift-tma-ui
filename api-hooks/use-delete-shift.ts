import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export const useDeleteShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        string
    >({
        mutationFn: async (id: string) => {
            await api.delete(`/api/shifts/${id}`);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['shifts'],
            });
        },
    });
};


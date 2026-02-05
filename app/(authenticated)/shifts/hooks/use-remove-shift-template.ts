import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';


export const useRemoveShiftTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            await api.delete(`/api/shift-templates/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shift-templates']});
        },
    });
};

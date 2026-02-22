import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";


export const useRemoveShiftTemplate = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        { id: string, type: 'onlyTemplate' | 'templateWithShifts' | 'templateWithShiftsAndEditedShifts' }
    >({
        mutationFn: async ({id, type}) => {
            await api.delete(`/api/shift-templates/${id}`, {params: {ownerId, type}});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shift-templates']});
        },
    });
};

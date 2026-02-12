import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from '@/api-hooks/use-get-shifts';

export type UpdateShiftPayload = {
    id: string;
    actualStartTime?: string | null;
    actualEndTime?: string | null;
};

export const useUpdateShift = () => {
    const queryClient = useQueryClient();

    return useMutation<ShiftDto, Error, UpdateShiftPayload>({
        mutationFn: async (payload) => {
            const {data} = await api.patch<ShiftDto>(`/api/shifts/${payload.id}`, {
                actualStartTime: payload.actualStartTime,
                actualEndTime: payload.actualEndTime,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['month-shifts']});
        },
    });
};

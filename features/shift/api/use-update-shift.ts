import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { useOwnerId } from '@/entities/user';
import { ENDPOINTS } from '@/shared/config/api';
import type { ShiftDto, UpdateShiftPayload } from '@/features/shift/model';

export const useUpdateShift = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<ShiftDto, Error, UpdateShiftPayload>({
        mutationFn: async ({ id, actualStartTime, actualEndTime }) => {
            const { data } = await api.patch<ShiftDto>(ENDPOINTS.updateShift(id), {
                actualStartTime,
                actualEndTime,
            }, { params: { ownerId } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['month-shifts'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['shifts-by-date'], exact: false });
        },
    });
};

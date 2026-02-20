import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from '@/api-hooks/shift/use-get-shifts';
import {useOwnerId} from "@/hooks/use-owner-id";

export type UpdateShiftPayload = {
    id: string;
    actualStartTime?: string | null;
    actualEndTime?: string | null;
};

export const useUpdateShift = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<ShiftDto, Error, UpdateShiftPayload>({
        mutationFn: async (payload) => {
            const {data} = await api.patch<ShiftDto>(`/api/shifts/${payload.id}`, {
                actualStartTime: payload.actualStartTime,
                actualEndTime: payload.actualEndTime,
            }, {params: {ownerId}});
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['month-shifts'], exact: false});
            queryClient.invalidateQueries({queryKey: ['shifts-by-date'], exact: false});
        },
    });
};

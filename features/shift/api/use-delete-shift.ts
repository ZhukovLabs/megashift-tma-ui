import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { scheduleCancelAndInvalidate } from '@/shared/lib';
import { useOwnerId } from '@/entities/user';
import { ENDPOINTS } from '@/shared/config/api';
import type { ShiftDto } from '@/features/shift/model';

const monthShiftsKey = (year: number, month: number) => ['month-shifts', year, month] as const;

export const useDeleteShift = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        { id: string; year: number; month: number },
        { previous: ShiftDto[]; queryKey: readonly (string | number)[] }
    >({
        mutationFn: async ({ id }) => {
            if (!id.startsWith('temp-')) {
                await api.delete(ENDPOINTS.deleteShift(id), { params: { ownerId } });
            }
        },
        onMutate: async ({ id, year, month }) => {
            const queryKey = monthShiftsKey(year, month);

            await queryClient.cancelQueries({ queryKey, exact: true });

            const previous = queryClient.getQueryData<ShiftDto[]>(queryKey) ?? [];
            queryClient.setQueryData<ShiftDto[]>(
                queryKey,
                previous.filter(shift => shift.id !== id)
            );
            return { previous, queryKey };
        },
        onError: (err, vars, context) => {
            const { year, month } = vars;
            const queryKey = monthShiftsKey(year, month);

            if (context) {
                queryClient.setQueryData<ShiftDto[]>(queryKey, context.previous);
            }

            scheduleCancelAndInvalidate(queryClient, queryKey);
        },
        onSuccess: (_data, vars, context) => {
            const { year, month } = vars;
            const queryKey = context?.queryKey ?? monthShiftsKey(year, month);
            queryClient.invalidateQueries({ queryKey: ['shifts-by-date'] });
            scheduleCancelAndInvalidate(queryClient, queryKey);
        },
    });
};

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from "@/api-hooks/schedule/use-get-shifts";
import { scheduleCancelAndInvalidate } from '@/utils/react-query-utils';

const monthShiftsKey = (year: number, month: number) => ['month-shifts', year, month] as const;

export const useDeleteShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        {id: string; year: number; month: number},
        { previous: ShiftDto[]; queryKey: readonly (string | number)[] }
    >({
        mutationFn: async ({id}) => {
            await api.delete(`/api/shifts/${id}`);
        },
        onMutate: async ({id, year, month}) => {
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
            queryClient.invalidateQueries({queryKey:['shifts-by-date']});
            scheduleCancelAndInvalidate(queryClient, queryKey);
        },
    });
};

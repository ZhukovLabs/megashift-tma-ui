import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from "@/api-hooks/use-get-shifts";
import { scheduleCancelAndInvalidate } from '@/utils/react-query-utils';

export const useDeleteShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        {id: string; year: number; month: number},
        { previous: ShiftDto[] }
    >({
        mutationFn: async ({id}) => {
            await api.delete(`/api/shifts/${id}`);
        },
        onMutate: async ({id, year, month}) => {
            const queryKey = ['month-shifts', year, month];

            // Отменяем текущие fetch'ы для этого month перед оптимистичным удалением
            await queryClient.cancelQueries({ queryKey, exact: true });

            const previous = queryClient.getQueryData<ShiftDto[]>(queryKey) ?? [];
            queryClient.setQueryData<ShiftDto[]>(
                queryKey,
                previous.filter(shift => shift.id !== id)
            );
            return { previous };
        },
        onError: (err, vars, context) => {
            const { year, month } = vars;
            const queryKey = ['month-shifts', year, month];

            if (context) {
                queryClient.setQueryData<ShiftDto[]>(queryKey, context.previous);
            }

            // Планируем централизованный рефетч — чтобы вернуть корректные данные с сервера
            scheduleCancelAndInvalidate(queryClient, queryKey);
        },
        onSuccess: (_data, vars) => {
            const { year, month } = vars;
            const queryKey = ['month-shifts', year, month];

            // Планируем централизованный cancel+invalidate
            scheduleCancelAndInvalidate(queryClient, queryKey);
        },
    });
};

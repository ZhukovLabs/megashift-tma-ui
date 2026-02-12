import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from "@/api-hooks/use-get-shifts";
import {v4 as uuidv4} from 'uuid';
import { scheduleCancelAndInvalidate } from '@/utils/react-query-utils';

export type CreateShiftPayload = {
    date: string;
    shiftTemplateId: string;
};

export const useCreateShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ShiftDto,
        Error,
        CreateShiftPayload,
        { previousShifts: ShiftDto[]; queryKey: (string | number)[] }
    >({
        mutationFn: async (payload) => {
            const {data} = await api.post<ShiftDto>('/api/shifts', payload);
            return data;
        },
        onMutate: async (payload) => {
            const dateObj = new Date(payload.date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const queryKey = ['month-shifts', year, month];

            // Отменяем текущие fetch'ы для этого month перед optimistic update
            await queryClient.cancelQueries({ queryKey, exact: true });

            const previousShifts = queryClient.getQueryData<ShiftDto[]>(queryKey) ?? [];
            const optimisticShift: ShiftDto = {
                id: `temp-${uuidv4()}`,
                date: payload.date,
                actualStartTime: null,
                actualEndTime: null,
                shiftTemplateId: payload.shiftTemplateId,
            };

            queryClient.setQueryData<ShiftDto[]>(queryKey, [...previousShifts, optimisticShift]);

            return { previousShifts, queryKey };
        },
        onError: (err, payload, context) => {
            if (context) {
                queryClient.setQueryData<ShiftDto[]>(context.queryKey, context.previousShifts);
                scheduleCancelAndInvalidate(queryClient, context.queryKey);
            }
        },
        onSuccess: (data, payload, context) => {
            if (!context) return;

            queryClient.setQueryData<ShiftDto[]>(context.queryKey, (old) => {
                if (!old) return [data];
                return [...old.filter(shift => !shift.id.startsWith('temp-')), data];
            });

            scheduleCancelAndInvalidate(queryClient, context.queryKey);
        },
    });
};

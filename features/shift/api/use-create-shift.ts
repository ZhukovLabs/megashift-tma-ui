import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { scheduleCancelAndInvalidate } from '@/shared/lib';
import { useOwnerId } from '@/entities/user';
import { ENDPOINTS } from '@/shared/config/api';
import type { ShiftDto } from '@/features/shift/model';
import { v4 as uuidv4 } from 'uuid';

export type CreateShiftPayload = {
    date: string;
    revalidateDate: string;
    shiftTemplateId: string;
};

const monthShiftsKey = (year: number, month: number) => ['month-shifts', year, month] as const;

export const useCreateShift = () => {
    const ownerId = useOwnerId();
    const queryClient = useQueryClient();


    return useMutation<
        ShiftDto,
        Error,
        CreateShiftPayload,
        { previousShifts: ShiftDto[]; queryKey: readonly (string | number)[] }
    >({
        mutationFn: async (payload) => {
            const {data} = await api.post<ShiftDto>(ENDPOINTS.createShift, {
                date: payload.date,
                shiftTemplateId: payload.shiftTemplateId,
            }, {params: {ownerId}});
            return data;
        },
        onMutate: async (payload) => {
            const dateObj = new Date(payload.revalidateDate);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const queryKey = monthShiftsKey(year, month);

            await queryClient.cancelQueries({queryKey, exact: false});

            const previousShifts = queryClient.getQueryData<ShiftDto[]>(queryKey) ?? [];
            const optimisticShift: ShiftDto = {
                id: `temp-${uuidv4()}`,
                date: payload.date,
                actualStartTime: null,
                actualEndTime: null,
                shiftTemplateId: payload.shiftTemplateId,
            };

            queryClient.setQueryData<ShiftDto[]>(queryKey, [...previousShifts, optimisticShift]);

            return {previousShifts, queryKey};
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

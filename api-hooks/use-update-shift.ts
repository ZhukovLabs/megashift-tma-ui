import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from '@/api-hooks/use-get-shifts';

export type UpdateShiftPayload = {
    id: string;
    actualStartTime?: string | null;
    actualEndTime?: string | null;
};

const monthShiftsKey = (year: number, month: number) => ['month-shifts', year, month] as const;

const parseYearMonthFromDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
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
        onSuccess: (data) => {
            const parsed = parseYearMonthFromDate(data?.date);
            if (parsed) {
                queryClient.invalidateQueries({ queryKey: monthShiftsKey(parsed.year, parsed.month), exact: true });
            } else {
                queryClient.invalidateQueries({ queryKey: ['month-shifts'], exact: false });
            }

            if (parsed) {
                queryClient.invalidateQueries({ queryKey: ['shift-statistics', parsed.year, parsed.month], exact: true });
                queryClient.invalidateQueries({ queryKey: ['shift-statistics-hours', parsed.year, parsed.month], exact: true });
            }
        },
    });
};

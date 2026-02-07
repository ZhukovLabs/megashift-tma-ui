import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ShiftDto} from "@/api-hooks/use-get-shifts";

export const useDeleteShift = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        unknown,
        string,
        { previous: Record<string, ShiftDto[]> }
    >({
        mutationFn: async (id: string) => {
            await api.delete(`/api/shifts/${id}`);
        },
        onMutate: async (id) => {
            const queries = queryClient.getQueriesData<ShiftDto[]>({
                queryKey: ['shifts'],
                exact: false,
            });
            const previous: Record<string, ShiftDto[]> = {};
            queries.forEach(([queryKey, data]) => {
                if (data) {
                    const keyStr = JSON.stringify(queryKey);
                    previous[keyStr] = data;
                    const newData = data.filter((shift) => shift.id !== id);
                    queryClient.setQueryData<ShiftDto[]>(queryKey, newData);
                }
            });
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) {
                Object.entries(context.previous).forEach(([keyStr, oldData]) => {
                    const queryKey = JSON.parse(keyStr);
                    queryClient.setQueryData<ShiftDto[]>(queryKey, oldData);
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['shifts'],
            });
        },
    });
};
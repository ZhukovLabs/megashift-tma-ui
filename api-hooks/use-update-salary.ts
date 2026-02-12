import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export enum SalaryType {
    HOURLY = 'HOURLY',
    SHIFT = 'SHIFT',
    MONTHLY = 'MONTHLY'
}

export type UpdateSalaryPayload = {
    typeSalary: 'HOURLY' | 'SHIFT' | 'MONTHLY';
    salary: number;
};

export const userSettingsKey = ['settings'] as const;

export const useUpdateSalary = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateSalaryPayload, Error, UpdateSalaryPayload>({
        mutationFn: async (payload) => {
            const {data} = await api.patch<UpdateSalaryPayload>('/api/settings/salary', payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: userSettingsKey, exact: true});
        },
    });
};

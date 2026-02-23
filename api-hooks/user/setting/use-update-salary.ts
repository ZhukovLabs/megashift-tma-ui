import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ENDPOINTS} from "@/shared/config/api";
import {Currency} from "@/app/(authenticated)/(scrollable)/settings/compensation/page";

export enum SalaryType {
    HOURLY = 'HOURLY',
    SHIFT = 'SHIFT',
    MONTHLY = 'MONTHLY'
}

export type UpdateSalaryPayload = {
    typeSalary: 'HOURLY' | 'SHIFT' | 'MONTHLY';
    salary: number;
    maxSalary?: number;
    currency: Currency
};

export const userSettingsKey = ['settings'] as const;

export const useUpdateSalary = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateSalaryPayload, Error, UpdateSalaryPayload>({
        mutationFn: async (payload) => {
            const {data} = await api.patch<UpdateSalaryPayload>(ENDPOINTS.updateSalary, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userSettingsKey, exact: true});
        },
    });
};

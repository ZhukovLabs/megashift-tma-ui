import {useQuery} from '@tanstack/react-query';
import {api} from '@/shared/config/axios';
import {SalaryType} from '@/entities/salary';
import {Currency} from "@/entities/currency";
import {ENDPOINTS} from "@/shared/config/api";

export type UserSettings = {
    salary: number;
    typeSalary: SalaryType;
    maxSalary?: number | null;
    currency: Currency;
};

export const getUserSettingsKey = ['settings'] as const;

export const useGetUserSettings = () => {
    return useQuery<UserSettings, Error>({
        queryKey: getUserSettingsKey,
        queryFn: async () => {
            const {data} = await api.get<UserSettings>(ENDPOINTS.getSettings);
            return data;
        }
    });
};

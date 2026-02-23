import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {SalaryType} from './use-update-salary';
import {ENDPOINTS} from "@/shared/config/api";
import {Currency} from "@/app/(authenticated)/(scrollable)/settings/compensation/page";

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

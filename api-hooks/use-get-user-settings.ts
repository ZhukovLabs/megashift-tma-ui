import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {SalaryType} from './use-update-salary';

export type UserSettings = {
    salary: number;
    typeSalary: SalaryType;
    maxSalary?: number | null;
};

export const userSettingsKey = ['settings'] as const;

export const useGetUserSettings = () => {
    return useQuery<UserSettings, Error>({
        queryKey: userSettingsKey,
        queryFn: async () => {
            const {data} = await api.get<UserSettings>('/api/settings');
            return data;
        }
    });
};

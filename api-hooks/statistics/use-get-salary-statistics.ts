import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";

export type SalaryStatistics = {
    salary: number;
    typeSalary: 'HOURLY' | 'SHIFT' | 'MONTHLY' | 'UNKNOWN';
    maxSalary: number;
};

const salaryStatisticsKey = (year: number, month: number) =>
    ['salary-statistics', year, month] as const;

export const useGetSalaryStatistics = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<SalaryStatistics, Error>({
        queryKey: salaryStatisticsKey(year, month),
        queryFn: async () => {
            const {data} = await api.get<SalaryStatistics>('/api/statistics/salary', {
                params: {year, month, ownerId},
            });
            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};

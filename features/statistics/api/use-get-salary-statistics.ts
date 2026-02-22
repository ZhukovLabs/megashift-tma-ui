import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from "@/hooks/use-owner-id";
import {SalaryType} from "@/entities/salary/model/types";
import {ENDPOINTS} from "@/shared/config/api";

export type SalaryStatistics = {
    salary: number;
    typeSalary: SalaryType;
    maxSalary: number;
};

const salaryStatisticsKey = (year: number, month: number) =>
    ['salary-statistics', year, month] as const;

export const useGetSalaryStatistics = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<SalaryStatistics, Error>({
        queryKey: salaryStatisticsKey(year, month),
        queryFn: async ({signal}) => {
            const controller = new AbortController();
            signal.addEventListener('abort', () => controller.abort());

            const {data} = await api.get<SalaryStatistics>(ENDPOINTS.getSalaryStatistic, {
                params: {year, month, ownerId},
                signal: controller.signal,
            });

            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};
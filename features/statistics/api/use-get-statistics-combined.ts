import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from '@/hooks/use-owner-id';
import {ENDPOINTS} from '@/shared/config/api';
import {SalaryType} from '@/entities/salary/model/types';

export type ShiftStatisticsCountItem = {
    id: string;
    shiftName: string;
    count: number;
    color: string;
};

export type ShiftStatisticsHoursItem = {
    id: string;
    shiftName: string;
    hours: number;
    color: string;
};

export type SalaryStatistics = {
    salary: number;
    typeSalary: SalaryType;
    maxSalary: number;
};

export type StatisticsCombinedResponse = {
    shifts: ShiftStatisticsCountItem[];
    hours: ShiftStatisticsHoursItem[];
    salary: SalaryStatistics;
};

const statisticsCombinedKey = (year: number, month: number) =>
    ['statistics-combined', year, month] as const;

export const useGetStatisticsCombined = (year: number, month: number) => {
    const ownerId = useOwnerId();

    return useQuery<StatisticsCombinedResponse, Error>({
        queryKey: statisticsCombinedKey(year, month),
        queryFn: async ({signal}) => {
            const {data} = await api.get<StatisticsCombinedResponse>(
                ENDPOINTS.getStatisticsCombined,
                {
                    params: {year, month, ownerId},
                    signal,
                }
            );
            return data;
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
};

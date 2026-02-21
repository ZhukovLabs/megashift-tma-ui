import { useMemo } from 'react';
import {
    useGetSalaryStatistics,
    useGetShiftStatisticsCount,
    useGetShiftStatisticsHours,
} from '../api';
import { mapShiftToStatisticItems } from './map-shift-to-statistic-item';
import { mapShiftHoursToStatisticItems } from './map-shift-hours-to-statistic-item';
import { SalaryType } from '@/entities/salary/model/types';

export function useStatisticsData(year: number, month: number) {
    const {
        data: shiftCount,
        isLoading: shiftCountLoading,
    } = useGetShiftStatisticsCount(year, month);

    const {
        data: shiftHours,
        isLoading: shiftHoursLoading,
    } = useGetShiftStatisticsHours(year, month);

    const {
        data: salaryData,
        isLoading: salaryLoading,
    } = useGetSalaryStatistics(year, month);

    const itemsCount = useMemo(
        () => (shiftCount ? mapShiftToStatisticItems(shiftCount) : []),
        [shiftCount]
    );

    const itemsHours = useMemo(
        () => (shiftHours ? mapShiftHoursToStatisticItems(shiftHours) : []),
        [shiftHours]
    );

    return {
        shiftCount: {
            items: itemsCount,
            isLoading: shiftCountLoading,
        },
        shiftHours: {
            items: itemsHours,
            isLoading: shiftHoursLoading,
        },
        salary: {
            typeSalary: salaryData?.typeSalary ?? SalaryType.UNKNOWN,
            salary: salaryData?.salary ?? 0,
            maxSalary: salaryData?.maxSalary ?? 0.01,
            isLoading: salaryLoading,
        },
    };
}
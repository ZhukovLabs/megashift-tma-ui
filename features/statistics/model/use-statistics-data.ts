import {useMemo} from 'react';
import {useGetStatisticsCombined} from '../api/use-get-statistics-combined';
import {mapShiftToStatisticItems} from './map-shift-to-statistic-item';
import {mapShiftHoursToStatisticItems} from './map-shift-hours-to-statistic-item';
import {SalaryType} from '@/entities/salary/model/types';

export function useStatisticsData(year: number, month: number) {
    const {data, isLoading} = useGetStatisticsCombined(year, month);

    const itemsCount = useMemo(
        () => (data?.shifts ? mapShiftToStatisticItems(data.shifts) : []),
        [data?.shifts]
    );

    const itemsHours = useMemo(
        () => (data?.hours ? mapShiftHoursToStatisticItems(data.hours) : []),
        [data?.hours]
    );

    return {
        isLoading,
        shiftCount: {
            items: itemsCount,
        },
        shiftHours: {
            items: itemsHours,
        },
        salary: {
            typeSalary: data?.salary?.typeSalary ?? SalaryType.UNKNOWN,
            salary: data?.salary?.salary ?? 0,
            maxSalary: data?.salary?.maxSalary ?? 0.01,
        },
    };
}

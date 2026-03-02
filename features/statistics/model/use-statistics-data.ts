import {useGetStatisticsCombined} from '@/features/statistics/api';
import {mapShiftToStatisticItems} from './map-shift-to-statistic-item';
import {mapShiftHoursToStatisticItems} from './map-shift-hours-to-statistic-item';
import {SalaryType} from '@/entities/salary';

export function useStatisticsData(year: number, month: number) {
    const {data, isLoading} = useGetStatisticsCombined(year, month);

    const itemsCount = data?.shifts ? mapShiftToStatisticItems(data.shifts) : [];
    const itemsHours = data?.hours ? mapShiftHoursToStatisticItems(data.hours) : [];

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

import {useGetStatisticsCombined} from '@/features/statistics/api';
import {mapShiftToStatisticItems} from './map-shift-to-statistic-item';
import {mapShiftHoursToStatisticItems} from './map-shift-hours-to-statistic-item';
import {SalaryType} from '@/entities/salary';
import {useState, useMemo, useEffect} from 'react';
import {useUserStore} from '@/entities/user';

const STORAGE_KEY = 'megashift_excluded_shift_ids';

export function useStatisticsData(year: number, month: number) {
    const {data, isLoading} = useGetStatisticsCombined(year, month);
    const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);

    // Загрузка исключенных ID при инициализации
    useEffect(() => {
        const loadExcludedIds = () => {
            try {
                const value = window.sessionStorage.getItem(STORAGE_KEY);
                if (value) {
                    const ids = JSON.parse(value);
                    if (Array.isArray(ids)) {
                        setExcludedIds(new Set(ids));
                    }
                }
            } catch (error) {
                console.error('[Storage] Failed to load excluded IDs:', error);
            } finally {
                setIsStorageLoaded(true);
            }
        };

        if (typeof window !== 'undefined') {
            loadExcludedIds();
        }
    }, []);

    const toggleExclude = (id: string) => {
        setExcludedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            
            // Сохраняем
            try {
                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
                }
            } catch (error) {
                console.error('[Storage] Failed to save excluded IDs:', error);
            }
            
            return next;
        });
    };

    const allItemsCount = useMemo(() => 
        data?.shifts ? mapShiftToStatisticItems(data.shifts) : [], 
    [data?.shifts]);

    const allItemsHours = useMemo(() => 
        data?.hours ? mapShiftHoursToStatisticItems(data.hours) : [], 
    [data?.hours]);

    const shiftCount = useMemo(() => ({
        items: allItemsCount.map(item => ({
            ...item,
            isExcluded: excludedIds.has(item.id)
        })),
        filteredItems: allItemsCount.filter(item => !excludedIds.has(item.id))
    }), [allItemsCount, excludedIds]);

    const shiftHours = useMemo(() => ({
        items: allItemsHours.map(item => ({
            ...item,
            isExcluded: excludedIds.has(item.id)
        })),
        filteredItems: allItemsHours.filter(item => !excludedIds.has(item.id))
    }), [allItemsHours, excludedIds]);

    // Расчет зарплаты на основе фильтра
    const calculatedSalary = useMemo(() => {
        if (!data?.salary) return 0;
        
        const type = data.salary.typeSalary;
        const baseRate = data.salary.salary; 

        if (type === SalaryType.MONTHLY) {
            return baseRate;
        }

        if (type === SalaryType.HOURLY) {
            const totalHours = shiftHours.filteredItems.reduce((acc, item) => acc + item.value, 0);
            return totalHours * baseRate;
        }

        if (type === SalaryType.SHIFT) {
            const totalShifts = shiftCount.filteredItems.reduce((acc, item) => acc + item.value, 0);
            return totalShifts * baseRate;
        }

        return 0;
    }, [data?.salary, shiftCount.filteredItems, shiftHours.filteredItems]);

    return {
        isLoading: isLoading || !isStorageLoaded,
        shiftCount,
        shiftHours,
        toggleExclude,
        excludedIds,
        salary: {
            typeSalary: data?.salary?.typeSalary ?? SalaryType.UNKNOWN,
            salary: calculatedSalary,
            maxSalary: data?.salary?.maxSalary ?? 0.01,
        },
    };
}

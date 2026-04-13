import type {StatisticItem} from '@/features/statistics/ui/statistics-table';
import {useGetStatisticsCombined} from '@/features/statistics/api';
import {mapShiftToStatisticItems} from './map-shift-to-statistic-item';
import {mapShiftHoursToStatisticItems} from './map-shift-hours-to-statistic-item';
import {SalaryType} from '@/entities/salary';
import {useState, useMemo, useEffect, useCallback} from 'react';
import {deviceStorage} from '@/shared/lib/device-storage';

const getStorageKey = (blockId: string) => `megashift_excluded_shift_ids_${blockId}`;

const loadExcludedIds = async (blockId: string): Promise<Set<string>> => {
    try {
        const value = await deviceStorage.get(getStorageKey(blockId));
        if (value) {
            const ids = JSON.parse(value);
            if (Array.isArray(ids)) {
                return new Set(ids);
            }
        }
    } catch (error) {
        console.error(`[DeviceStorage] Failed to load excluded IDs for ${blockId}:`, error);
    }
    return new Set();
};

const saveExcludedIds = async (blockId: string, ids: Set<string>) => {
    try {
        await deviceStorage.set(getStorageKey(blockId), JSON.stringify(Array.from(ids)));
    } catch (error) {
        console.error(`[DeviceStorage] Failed to save excluded IDs for ${blockId}:`, error);
    }
};

export function useStatisticsData(year: number, month: number) {
    const {data, isLoading} = useGetStatisticsCombined(year, month);

    const allItemsCount = useMemo(() => 
        data?.shifts ? mapShiftToStatisticItems(data.shifts) : [], 
    [data?.shifts]);

    const allItemsHours = useMemo(() => 
        data?.hours ? mapShiftHoursToStatisticItems(data.hours) : [], 
    [data?.hours]);

    // Хук для отдельного блока статистики
    const useBlockStatistics = useCallback((blockId: string) => {
        const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
        const [isStorageLoaded, setIsStorageLoaded] = useState(false);

        useEffect(() => {
            let mounted = true;
            
            loadExcludedIds(blockId).then(ids => {
                if (mounted) {
                    setExcludedIds(ids);
                    setIsStorageLoaded(true);
                }
            });
            
            return () => { mounted = false; };
        }, [blockId]);

        const toggleExclude = (id: string) => {
            setExcludedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                saveExcludedIds(blockId, next);
                return next;
            });
        };

        const itemsCount = useMemo(() => ({
            items: allItemsCount.map(item => ({
                ...item,
                isExcluded: excludedIds.has(item.id)
            })),
            filteredItems: allItemsCount.filter(item => !excludedIds.has(item.id))
        }), [allItemsCount, excludedIds]);

        const itemsHours = useMemo(() => ({
            items: allItemsHours.map(item => ({
                ...item,
                isExcluded: excludedIds.has(item.id)
            })),
            filteredItems: allItemsHours.filter(item => !excludedIds.has(item.id))
        }), [allItemsHours, excludedIds]);

        return {
            isLoading: isLoading || !isStorageLoaded,
            itemsCount,
            itemsHours,
            toggleExclude,
            excludedIds,
        };
    }, [allItemsCount, allItemsHours, isLoading]);

    const calculateSalary = useCallback((
        filteredCount: StatisticItem[],
        filteredHours: StatisticItem[]
    ) => {
        if (!data?.salary) return { salary: 0, maxSalary: 0, typeSalary: SalaryType.UNKNOWN };
        
        const type = data.salary.typeSalary;
        const baseRate = data.salary.salary; 
        let calculated = 0;

        if (type === SalaryType.MONTHLY) {
            calculated = baseRate;
        } else if (type === SalaryType.HOURLY) {
            const totalHours = filteredHours.reduce((acc, item) => acc + item.value, 0);
            calculated = totalHours * baseRate;
        } else if (type === SalaryType.SHIFT) {
            const totalShifts = filteredCount.reduce((acc, item) => acc + item.value, 0);
            calculated = totalShifts * baseRate;
        }

        return {
            salary: calculated,
            maxSalary: data.salary.maxSalary,
            typeSalary: data.salary.typeSalary,
        };
    }, [data?.salary]);

    return {
        isLoading,
        useBlockStatistics,
        calculateSalary,
    };
}

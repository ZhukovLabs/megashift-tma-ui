import type {StatisticItem} from "../ui/statistics-table/index";
import type {ShiftStatisticsCountItem} from "../api/use-get-shift-statistics-count";

export const mapShiftToStatisticItems = (stats: ShiftStatisticsCountItem[]): StatisticItem[] => (
    stats.map(s => ({
        id: s.id,
        label: s.shiftName,
        value: s.count,
        color: s.color,
    }))
);
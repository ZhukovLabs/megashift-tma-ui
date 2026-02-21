import type {StatisticItem} from "../ui/statistics-table";
import type {ShiftStatisticsHoursItem} from "../api/use-get-shift-statistics-hours";

export const mapShiftHoursToStatisticItems = (stats: ShiftStatisticsHoursItem[]): StatisticItem[] => (
    stats.map(s => ({
        id: s.id,
        label: s.shiftName,
        value: s.hours,
        color: s.color,
    }))
);
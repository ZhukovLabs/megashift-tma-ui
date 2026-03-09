'use client';

import {createContext, useContext, ReactNode, useCallback, useMemo} from "react";
import {addMonths, subMonths, format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek as startOfWeekFn, endOfWeek as endOfWeekFn} from "date-fns";
import type { ShiftDto } from '@/features/shift/model';

export type CalendarEvent = ShiftDto;

export type Holiday = {
    date: Date;
    name?: string;
    type?: 'holiday' | 'celebration';
};

export type WeekendHighlight = 'none' | 'background' | 'text' | 'both';

export type ScheduleProps = {
    showWeekends?: boolean;
    weekendHighlight?: WeekendHighlight;
    startOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    holidays?: Holiday[];
    highlightToday?: boolean;
    showWeekNumbers?: boolean;
};

type ScheduleContextType = {
    currentDate: Date;
    prevDate: Date;
    nextDate: Date;
    nextMonth: VoidFunction;
    prevMonth: VoidFunction;
    shifts: CalendarEvent[];
    onDayClick?: (day: Date, events: CalendarEvent[]) => void;
    config: ScheduleProps;
    isHoliday: (day: Date) => Holiday | undefined;
    isWeekend: (day: Date) => boolean;
    getCalendarDays: (monthDate: Date) => Date[];
};

type ScheduleProviderProps = {
    children: ReactNode;
    currentDate: Date;
    onDateChange: (date: Date) => void;
    shifts?: CalendarEvent[];
    onDayClick?: (day: Date, events: CalendarEvent[]) => void;
} & ScheduleProps;

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const DEFAULT_PROPS: ScheduleProps = {
    showWeekends: true,
    weekendHighlight: 'background',
    startOfWeek: 1,
    holidays: [],
    highlightToday: true,
    showWeekNumbers: false,
};

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const getDayNames = (startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    const result = [];
    for (let i = 0; i < 7; i++) {
        const idx = (startOfWeek + i) % 7;
        result.push(DAY_NAMES[idx]);
    }
    return result;
};

export const ScheduleProvider = ({
                                     children,
                                     currentDate,
                                     onDateChange,
                                     shifts = [],
                                     onDayClick,
                                     showWeekends = DEFAULT_PROPS.showWeekends,
                                     weekendHighlight = DEFAULT_PROPS.weekendHighlight,
                                     startOfWeek = DEFAULT_PROPS.startOfWeek,
                                     holidays = DEFAULT_PROPS.holidays,
                                     highlightToday = DEFAULT_PROPS.highlightToday,
                                     showWeekNumbers = DEFAULT_PROPS.showWeekNumbers,
                                 }: ScheduleProviderProps) => {

    const config = useMemo(() => ({
        showWeekends,
        weekendHighlight,
        startOfWeek,
        holidays,
        highlightToday,
        showWeekNumbers,
    }), [showWeekends, weekendHighlight, startOfWeek, holidays, highlightToday, showWeekNumbers]);

    const nextMonth = useCallback(() => onDateChange(addMonths(currentDate, 1)), [currentDate, onDateChange]);
    const prevMonth = useCallback(() => onDateChange(subMonths(currentDate, 1)), [currentDate, onDateChange]);

    const prevDate = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), [currentDate]);
    const nextDate = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1), [currentDate]);

    const isHoliday = useCallback((day: Date) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        return (holidays || []).find(h => format(h.date, 'yyyy-MM-dd') === dayStr);
    }, [holidays]);

    const isWeekend = useCallback((day: Date) => {
        const dayOfWeek = getDay(day);
        return dayOfWeek === 0 || dayOfWeek === 6;
    }, []);

    const getCalendarDays = useCallback((monthDate: Date): Date[] => {
        const monthStart = startOfMonth(monthDate);
        const weekStart = config.startOfWeek ?? 1;
        const calendarStart = startOfWeekFn(monthStart, { weekStartsOn: weekStart });
        
        const calendarEnd = new Date(calendarStart);
        calendarEnd.setDate(calendarEnd.getDate() + 41);
        
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [config.startOfWeek]);

    return (
        <ScheduleContext.Provider
            value={{
                currentDate,
                prevDate,
                nextDate,
                nextMonth,
                prevMonth,
                shifts,
                onDayClick,
                config,
                isHoliday,
                isWeekend,
                getCalendarDays,
            }}
        >
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error("useSchedule must be used within ScheduleProvider");
    return context;
};

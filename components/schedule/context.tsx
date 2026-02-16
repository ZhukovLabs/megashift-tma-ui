'use client';

import {createContext, useContext, ReactNode, useRef, useLayoutEffect, useState} from "react";
import {addMonths, subMonths} from "date-fns";
import {CELL_ROWS} from "./config";
import {ShiftDto} from "@/api-hooks/schedule/use-get-shifts";

export type CalendarEvent = ShiftDto;

type ScheduleContextType = {
    currentDate: Date;
    prevDate: Date;
    nextDate: Date;
    nextMonth: VoidFunction;
    prevMonth: VoidFunction;
    monthHeight: number;
    cellHeight: number;
    shifts: CalendarEvent[];
    onDayClick?: (day: Date, events: CalendarEvent[]) => void;
};

type ScheduleProviderProps = {
    children: ReactNode;
    currentDate: Date;
    onDateChange: (date: Date) => void;
    shifts?: CalendarEvent[];
    onDayClick?: (day: Date, events: CalendarEvent[]) => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({
                                     children,
                                     currentDate,
                                     onDateChange,
                                     shifts = [],
                                     onDayClick,
                                 }: ScheduleProviderProps) => {
    const [monthHeight, setMonthHeight] = useState(0);
    const [cellHeight, setCellHeight] = useState(0);
    const viewportRef = useRef<HTMLDivElement>(null);

    const nextMonth = () => onDateChange(addMonths(currentDate, 1));
    const prevMonth = () => onDateChange(subMonths(currentDate, 1));

    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    useLayoutEffect(() => {
        const measure = () => {
            if (!viewportRef.current) return;
            const style = getComputedStyle(viewportRef.current);
            const paddingTop = parseInt(style.paddingTop) || 0;
            const paddingBottom = parseInt(style.paddingBottom) || 0;
            const gap = 37;
            const totalGap = gap * (CELL_ROWS - 1);
            const totalHeight = viewportRef.current.clientHeight - paddingTop - paddingBottom - totalGap;

            setMonthHeight(viewportRef.current.clientHeight);
            setCellHeight(Math.floor(totalHeight / CELL_ROWS));
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    return (
        <ScheduleContext.Provider
            value={{
                currentDate,
                prevDate,
                nextDate,
                nextMonth,
                prevMonth,
                monthHeight,
                cellHeight,
                shifts,
                onDayClick,
            }}
        >
            <div ref={viewportRef} className="flex-1">{children}</div>
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error("useSchedule must be used within ScheduleProvider");
    return context;
};

'use client';

import { createContext, useContext, useState, ReactNode, useRef, useLayoutEffect } from "react";
import { addMonths, subMonths } from "date-fns";
import { CELL_ROWS } from "./config";

type ScheduleContextType = {
    currentDate: Date;
    prevDate: Date;
    nextDate: Date;
    nextMonth: VoidFunction;
    prevMonth: VoidFunction;
    monthHeight: number;
    cellHeight: number;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthHeight, setMonthHeight] = useState(0);
    const [cellHeight, setCellHeight] = useState(0);
    const viewportRef = useRef<HTMLDivElement>(null);

    const nextMonth = () => setCurrentDate(d => addMonths(d, 1));
    const prevMonth = () => setCurrentDate(d => subMonths(d, 1));

    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    useLayoutEffect(() => {
        const measure = () => {
            if (!viewportRef.current) return;

            const style = getComputedStyle(viewportRef.current);
            const paddingTop = parseInt(style.paddingTop) || 0;
            const paddingBottom = parseInt(style.paddingBottom) || 0;
            const gap = 36;
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
        <ScheduleContext.Provider value={{ currentDate, prevDate, nextDate, nextMonth, prevMonth, monthHeight, cellHeight }}>
            <div ref={viewportRef} className="flex-1">{children}</div>
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error("useSchedule must be used within ScheduleProvider");
    return context;
};

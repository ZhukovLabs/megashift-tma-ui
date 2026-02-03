'use client';

import {createContext, useContext, useState, ReactNode} from "react";
import {addMonths, subMonths} from "date-fns";

type ScheduleContextType = {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    nextMonth: VoidFunction;
    prevMonth: VoidFunction;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({children}: { children: ReactNode }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(d => addMonths(d, 1));
    const prevMonth = () => setCurrentDate(d => subMonths(d, 1));

    return (
        <ScheduleContext.Provider value={{currentDate, setCurrentDate, nextMonth, prevMonth}}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useSchedule must be used within a ScheduleProvider");
    }
    return context;
};

"use client";

import React, {useState, useEffect} from "react";
import {useMotionValue, animate, PanInfo} from "framer-motion";
import {CalendarHeader, WeekdaysHeader, MonthStack} from "./subcomponents";
import {useSchedule} from "./context";
import {Direction} from "./types";
import {THRESHOLD_FACTOR, SPRING_MAIN, SPRING_SNAP} from "./config";
import {useScheduleStore} from "@/store/schedule-store";

export const Schedule = () => {
    const {currentDate, nextMonth, prevMonth, monthHeight} = useSchedule();
    const y = useMotionValue(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (monthHeight > 0) y.set(-monthHeight);
    }, [monthHeight, y]);

    const changeMonth = async (direction: Direction) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const targetY = direction === "prev" ? 0 : -monthHeight * 2;
        await animate(y, targetY, SPRING_MAIN);

        if (direction === "prev") prevMonth();
        else nextMonth();

        y.set(-monthHeight);
        setIsAnimating(false);
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (isAnimating) return;

        const threshold = monthHeight * THRESHOLD_FACTOR;

        if (info.offset.y < -threshold) changeMonth("next");
        else if (info.offset.y > threshold) changeMonth("prev");
        else animate(y, -monthHeight, SPRING_SNAP);
    };

    return (
        <div className="h-dvh bg-base-100 flex flex-col select-none touch-none">
            <CalendarHeader currentDate={currentDate}/>
            <WeekdaysHeader/>
            <MonthStack dragProps={{y, isAnimating, handleDragEnd}}/>
        </div>
    );
};

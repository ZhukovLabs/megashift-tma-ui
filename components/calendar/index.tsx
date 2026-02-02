"use client";

import React, {useLayoutEffect, useRef, useState, useEffect} from "react";
import {
    addMonths,
    subMonths,
} from "date-fns";
import {motion, useMotionValue, animate, useAnimate, PanInfo} from "framer-motion";
import {Direction} from "./types";
import {CalendarHeader, WeekdaysHeader, MonthGrid} from "./subcomponents";

import {
    DEFAULT_MONTH_HEIGHT,
    GAP_AND_PADDING,
    CELL_ROWS,
    DRAG_ELASTIC,
    DRAG_CONSTRAINTS_MULTIPLIER,
    THRESHOLD_FACTOR,
    SPRING_MAIN,
    SPRING_SNAP,
} from "./config";

export function Calendar() {
    const viewportRef = useRef<HTMLDivElement>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthHeight, setMonthHeight] = useState(DEFAULT_MONTH_HEIGHT);
    const [isAnimating, setIsAnimating] = useState(false);

    const y = useMotionValue(0);
    const [scope, animateFn] = useAnimate();

    useLayoutEffect(() => {
        const measure = () => {
            if (viewportRef.current) {
                setMonthHeight(viewportRef.current.clientHeight);
            }
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        y.set(-monthHeight);
    }, [currentDate, monthHeight, y]);

    const cellHeight = Math.floor((monthHeight - GAP_AND_PADDING) / CELL_ROWS);

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const changeMonth = async (direction: Direction) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const targetY = direction === "prev" ? 0 : -monthHeight * 2;

        await animateFn(y, targetY, SPRING_MAIN);

        setCurrentDate((d) =>
            direction === "prev" ? subMonths(d, 1) : addMonths(d, 1)
        );

        y.set(-monthHeight);
        setIsAnimating(false);
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (isAnimating) return;

        const threshold = monthHeight * THRESHOLD_FACTOR;

        if (info.offset.y < -threshold) {
            changeMonth("next");
        } else if (info.offset.y > threshold) {
            changeMonth("prev");
        } else {
            animate(y, -monthHeight, SPRING_SNAP);
        }
    };

    return (
        <div className="h-dvh bg-base-100 p-4 flex flex-col select-none touch-none">
            <CalendarHeader
                currentDate={currentDate}
                onToday={() => setCurrentDate(new Date())}
            />

            <WeekdaysHeader/>

            <div
                ref={viewportRef}
                className="relative overflow-hidden rounded-2xl bg-base-200/40 shadow-inner flex-1"
            >
                <motion.div
                    ref={scope}
                    drag={!isAnimating ? "y" : false}
                    dragElastic={DRAG_ELASTIC}
                    dragMomentum={false}
                    dragConstraints={{top: -monthHeight * DRAG_CONSTRAINTS_MULTIPLIER, bottom: 0}}
                    onDragEnd={handleDragEnd}
                    style={{y}}
                    className="absolute inset-0 will-change-transform"
                >
                    <div style={{height: monthHeight}} className="pt-2 pb-2 px-2">
                        <MonthGrid date={prevMonth} cellHeight={cellHeight}/>
                    </div>

                    <div style={{height: monthHeight}} className="pt-2 pb-2 px-2">
                        <MonthGrid date={currentDate} cellHeight={cellHeight}/>
                    </div>

                    <div style={{height: monthHeight}} className="pt-2 pb-2 px-2">
                        <MonthGrid date={nextMonth} cellHeight={cellHeight}/>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

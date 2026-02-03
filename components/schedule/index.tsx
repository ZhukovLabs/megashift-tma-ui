"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate, useAnimate, PanInfo } from "framer-motion";
import { CalendarHeader, WeekdaysHeader, MonthGrid } from "./subcomponents";
import { Direction } from "./types";
import { useSchedule } from "./context";

import {
    CELL_ROWS,
    DRAG_ELASTIC,
    DRAG_CONSTRAINTS_MULTIPLIER,
    THRESHOLD_FACTOR,
    SPRING_MAIN,
    SPRING_SNAP,
    DEFAULT_MONTH_HEIGHT,
} from "./config";

export const Schedule = () => {
    const viewportRef = useRef<HTMLDivElement>(null);

    const { currentDate, nextMonth, prevMonth } = useSchedule();

    const [monthHeight, setMonthHeight] = useState(DEFAULT_MONTH_HEIGHT);
    const [gapAndPadding, setGapAndPadding] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const y = useMotionValue(0);
    const [scope, animateFn] = useAnimate();

    useLayoutEffect(() => {
        const measure = () => {
            if (viewportRef.current) {
                const style = getComputedStyle(viewportRef.current);
                const paddingTop = parseInt(style.paddingTop) || 0;
                const paddingBottom = parseInt(style.paddingBottom) || 0;
                const gap = 16;
                setMonthHeight(viewportRef.current.clientHeight);
                setGapAndPadding(8 + paddingTop + paddingBottom + gap * (CELL_ROWS - 1));
            }
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        y.set(-monthHeight);
    }, [currentDate, monthHeight, y]);

    const cellHeight = Math.floor((monthHeight - gapAndPadding) / CELL_ROWS);

    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const changeMonth = async (direction: Direction) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const targetY = direction === "prev" ? 0 : -monthHeight * 2;

        await animateFn(y, targetY, SPRING_MAIN);

        if (direction === "prev") prevMonth();
        else nextMonth();

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
        <div className="h-dvh bg-base-100 flex flex-col select-none touch-none">
            <CalendarHeader currentDate={currentDate} />
            <WeekdaysHeader />

            <div
                ref={viewportRef}
                className="relative overflow-hidden rounded-2xl bg-base-200/40 shadow-inner flex-1"
            >
                <motion.div
                    ref={scope}
                    drag={!isAnimating ? "y" : false}
                    dragElastic={DRAG_ELASTIC}
                    dragMomentum={false}
                    dragConstraints={{ top: -monthHeight * DRAG_CONSTRAINTS_MULTIPLIER, bottom: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{ y }}
                    className="absolute inset-0 will-change-transform"
                >
                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={prevMonthDate} cellHeight={cellHeight} />
                    </div>

                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={currentDate} cellHeight={cellHeight} />
                    </div>

                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={nextMonthDate} cellHeight={cellHeight} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

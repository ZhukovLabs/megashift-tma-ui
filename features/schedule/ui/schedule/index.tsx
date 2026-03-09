"use client";

import {useMemo, useRef, useState, useEffect, useCallback} from "react";
import {CalendarHeader, WeekdaysHeader} from "./subcomponents";
import {WeekRow} from "@/features/schedule/ui";
import {useSchedule} from "./context";
import {THRESHOLD_FACTOR} from "@/features/schedule/model";
import {motion, useAnimation} from "framer-motion";
import {viewport} from "@tma.js/sdk-react";

const CELL_ROWS = 6;

const SPRING = {
    stiffness: 300,
    damping: 30,
    mass: 1,
};

export const Schedule = () => {
    const {currentDate, getCalendarDays, nextMonth, prevMonth} = useSchedule();
    const gridRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const [cellHeight, setCellHeight] = useState(0);
    const isDragging = useRef(false);
    const isAnimating = useRef(false);

    const weeks = useMemo(() => {
        const days = getCalendarDays(currentDate);
        const weeksArray: Date[][] = [];

        while (weeksArray.length < CELL_ROWS) {
            const week = days.slice(weeksArray.length * 7, weeksArray.length * 7 + 7);
            if (week.length === 0) break;
            weeksArray.push(week);
        }

        return weeksArray;
    }, [currentDate, getCalendarDays]);

    useEffect(() => {
        const measure = () => {
            if (!gridRef.current) return;

            const rect = gridRef.current.getBoundingClientRect();
            const availableHeight = rect.height;

            setCellHeight(Math.floor(availableHeight / CELL_ROWS));
        };

        measure();

        const resizeObserver = new ResizeObserver(() => measure());
        if (gridRef.current) resizeObserver.observe(gridRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const handleDragEnd = useCallback(async (info: { offset: { y: number } }) => {
        if (!gridRef.current || isAnimating.current) return;
        isAnimating.current = true;

        const height = gridRef.current.clientHeight;
        const threshold = height * THRESHOLD_FACTOR;
        const offset = info.offset.y;

        if (offset < -threshold) {
            await controls.start({
                y: [0, -height * 0.3, -height],
                opacity: [1, 0.8, 0],
                transition: {duration: 0.25}
            });
            nextMonth();
            await controls.set({y: height, opacity: 0});
            await controls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        } else if (offset > threshold) {
            await controls.start({
                y: [0, height * 0.3, height],
                opacity: [1, 0.8, 0],
                transition: {duration: 0.25}
            });
            prevMonth();
            await controls.set({y: -height, opacity: 0});
            await controls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        } else {
            await controls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        }

        isAnimating.current = false;
    }, [controls, nextMonth, prevMonth]);

    const {top, bottom} = viewport.contentSafeAreaInsets();

    return (
        <div
            className="flex flex-col w-full min-w-0 overflow-hidden bg-base-100 box-border"
            style={{
                height: `calc(100dvh - ${top}px - ${bottom}px)`
            }}
        >
            <CalendarHeader/>
            <WeekdaysHeader/>
            <motion.div
                ref={gridRef}
                className="flex-1 flex flex-col min-h-0"
                drag="y"
                dragElastic={0.08}
                dragConstraints={{top: 0, bottom: 0}}
                dragMomentum={false}
                animate={controls}
                onDragStart={() => {
                    isDragging.current = true;
                }}
                onDragEnd={(_, info) => {
                    isDragging.current = false;
                    handleDragEnd(info);
                }}
                style={{
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity',
                }}
            >
                {weeks.map((week, w) => (
                    <div
                        key={w}
                        className="grid grid-cols-7 flex-shrink-0"
                        style={{height: cellHeight || 'auto'}}
                    >
                        <WeekRow week={week} monthDate={currentDate}/>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

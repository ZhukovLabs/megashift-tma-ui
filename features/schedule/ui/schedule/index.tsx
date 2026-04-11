"use client";

import {useMemo, useRef, useState, useEffect, useCallback} from "react";
import {CalendarHeader, WeekdaysHeader} from "./subcomponents";
import {WeekRow} from "@/features/schedule/ui";
import {useSchedule} from "./context";
import {THRESHOLD_FACTOR} from "@/features/schedule/model";
import {motion, useAnimation} from "framer-motion";

const CELL_ROWS = 6;

const SPRING = {
    stiffness: 400,
    damping: 40,
    mass: 0.5,
};

export const Schedule = () => {
    const {currentDate, getCalendarDays, nextMonth, prevMonth} = useSchedule();
    const gridRef = useRef<HTMLDivElement>(null); // Outer container for measuring height
    const calendarGridControls = useAnimation(); // Controls for the draggable part
    const [cellHeight, setCellHeight] = useState(0);
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
            setCellHeight(Math.floor(rect.height / CELL_ROWS));
        };
        measure();
        const resizeObserver = new ResizeObserver(() => measure());
        if (gridRef.current) resizeObserver.observe(gridRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const handleDragEnd = useCallback(async (info: { offset: { y: number } }) => {
        if (!gridRef.current || isAnimating.current) return;
        
        const height = gridRef.current.clientHeight;
        const threshold = height * THRESHOLD_FACTOR;
        const offset = info.offset.y;

        // Only trigger month change if drag is significant
        if (Math.abs(offset) < 30) { // Increased threshold slightly for better tap detection
            await calendarGridControls.start({ y: 0, transition: { duration: 0 } });
            return;
        }

        isAnimating.current = true;

        if (offset < -threshold) {
            await calendarGridControls.start({
                y: -height * 0.2,
                opacity: 0,
                transition: {duration: 0.15, ease: "easeOut"}
            });
            nextMonth();
            await calendarGridControls.set({y: height * 0.2, opacity: 0});
            await calendarGridControls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        } else if (offset > threshold) {
            await calendarGridControls.start({
                y: height * 0.2,
                opacity: 0,
                transition: {duration: 0.15, ease: "easeOut"}
            });
            prevMonth();
            await calendarGridControls.set({y: -height * 0.2, opacity: 0});
            await calendarGridControls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        } else {
            await calendarGridControls.start({
                y: 0,
                opacity: 1,
                transition: SPRING
            });
        }
        isAnimating.current = false;
    }, [calendarGridControls, nextMonth, prevMonth]);

    return (
        <div className="flex flex-col w-full h-full flex-1 overflow-hidden bg-base-100 relative">
            <CalendarHeader/>
            <WeekdaysHeader/>
            <div // This div is now the outer container for measuring height and holding the draggable grid
                ref={gridRef}
                className="flex-1 flex flex-col min-h-0 relative select-none overflow-hidden"
            >
                <motion.div // This motion.div handles the drag for month switching
                    className="flex-1 flex flex-col min-h-0"
                    drag="y"
                    dragElastic={0.05}
                    dragConstraints={{top: 0, bottom: 0}}
                    dragMomentum={false}
                    animate={calendarGridControls}
                    onDragEnd={(_, info) => {
                        handleDragEnd(info);
                    }}
                    style={{
                        willChange: 'transform, opacity',
                        touchAction: 'pan-x' // Allows horizontal scrolling (if any) but vertical is handled by drag
                    }}
                >
                    {weeks.map((week, w) => (
                        <div
                            key={w}
                            className="grid grid-cols-7 border-b border-base-200/30 last:border-b-0"
                            style={{height: cellHeight || 'auto'}}
                        >
                            <WeekRow week={week} monthDate={currentDate}/>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

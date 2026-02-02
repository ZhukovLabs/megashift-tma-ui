"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
    format,
    startOfMonth,
    startOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isToday,
} from "date-fns";
import { ru } from "date-fns/locale";
import { motion, useMotionValue, animate, useAnimate } from "framer-motion";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function MonthGrid({
                       date,
                       cellHeight,
                   }: {
    date: Date;
    cellHeight: number;
}) {
    const monthStart = startOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

    const rows: React.ReactNode[] = [];

    for (let week = 0; week < 6; week++) {
        const cells: React.ReactNode[] = [];

        for (let i = 0; i < 7; i++) {
            const d = addDays(startDate, week * 7 + i);
            const isCurrentMonth = isSameMonth(d, monthStart);

            cells.push(
                <div
                    key={d.getTime()}
                    style={{ height: cellHeight }}
                    className={`flex items-center justify-center rounded-lg transition-colors
            ${isCurrentMonth ? "hover:bg-base-200/70 cursor-pointer" : "pointer-events-none"}
          `}
                >
                    <div
                        className={`
              w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all
              ${!isCurrentMonth ? "text-base-content/25" : "text-base-content"}
              ${isToday(d) ? "bg-primary text-primary-content font-semibold shadow-sm" : ""}
            `}
                    >
                        {format(d, "d")}
                    </div>
                </div>
            );
        }

        rows.push(
            <div key={week} className="grid grid-cols-7 gap-1.5">
                {cells}
            </div>
        );
    }

    return <div className="space-y-1.5">{rows}</div>;
}

export function Calendar() {
    const outerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const weekRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthHeight, setMonthHeight] = useState(300);
    const [isAnimating, setIsAnimating] = useState(false);

    const y = useMotionValue(0);
    const [scope, animateFn] = useAnimate();

    useLayoutEffect(() => {
        const measure = () => {
            if (!viewportRef.current) return;

            const mh = viewportRef.current.clientHeight;

            setMonthHeight(mh);
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        y.set(-monthHeight);
    }, [currentDate, monthHeight, y]);

    const cellHeight = Math.floor((monthHeight - 46) / 6);

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const changeMonth = async (direction: "prev" | "next") => {
        if (isAnimating) return;
        setIsAnimating(true);

        const targetY = direction === "prev" ? 0 : -monthHeight * 2;

        await animateFn(
            y,
            targetY,
            {
                type: "spring",
                stiffness: 380,
                damping: 42,
                mass: 0.9,
            }
        );

        if (direction === "prev") {
            setCurrentDate((prev) => subMonths(prev, 1));
        } else {
            setCurrentDate((prev) => addMonths(prev, 1));
        }

        y.set(-monthHeight);
        setIsAnimating(false);
    };

    const handleDragEnd = (_: any, info: any) => {
        if (isAnimating) return;

        const threshold = monthHeight * 0.18;

        if (info.offset.y < -threshold) {
            changeMonth("next");
        } else if (info.offset.y > threshold) {
            changeMonth("prev");
        } else {
            animate(y, -monthHeight, {
                type: "spring",
                stiffness: 400,
                damping: 45,
            });
        }
    };

    return (
        <div
            ref={outerRef}
            className="h-dvh bg-base-100 p-4 flex flex-col select-none touch-none"
        >
            <div ref={headerRef} className="flex items-center justify-between mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {format(currentDate, "LLLL yyyy", { locale: ru })}
                </h1>

                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setCurrentDate(new Date())}
                >
                    Сегодня
                </button>
            </div>

            <div
                ref={weekRef}
                className="grid grid-cols-7 text-center text-sm font-medium text-base-content/60 mb-2"
            >
                {DAYS.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div
                ref={viewportRef}
                className="relative overflow-hidden rounded-2xl bg-base-200/40 shadow-inner flex-1"
            >
                <motion.div
                    ref={scope}
                    drag={!isAnimating ? "y" : false}
                    dragElastic={0.07}
                    dragMomentum={false}
                    dragConstraints={{ top: -monthHeight * 1.5, bottom: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{ y }}
                    className="absolute inset-0 will-change-transform"
                >
                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={prevMonth} cellHeight={cellHeight} />
                    </div>

                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={currentDate} cellHeight={cellHeight} />
                    </div>

                    <div style={{ height: monthHeight }} className="pt-2 pb-2 px-2">
                        <MonthGrid date={nextMonth} cellHeight={cellHeight} />
                    </div>
                </motion.div>
            </div>

            <div ref={controlsRef} className="flex justify-center gap-4 mt-4">
                <button
                    className="btn btn-circle btn-outline btn-sm"
                    onClick={() => changeMonth("prev")}
                    disabled={isAnimating}
                >
                    ←
                </button>
                <button
                    className="btn btn-circle btn-outline btn-sm"
                    onClick={() => changeMonth("next")}
                    disabled={isAnimating}
                >
                    →
                </button>
            </div>
        </div>
    );
}
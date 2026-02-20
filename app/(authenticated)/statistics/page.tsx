'use client';

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ShiftStatisticsTable, ShiftHoursStatisticsTable } from "@/components/shift-statistics-table";
import { SalaryStatisticsTable } from "@/components/salary-statistics-table";

type FormValues = {
    year: number;
    month: number;
};

const SWIPE_OFFSET_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 800;

const SlideContent = React.forwardRef<HTMLDivElement, { year: number; month: number }>(
    function SlideContent({ year, month }, ref) {
        return (
            <div ref={ref} className="w-full space-y-6 px-4 md:px-0">
                <div className="text-center mb-1">
                    <div className="text-lg font-medium">
                        {new Date(year, month - 1).toLocaleString("ru", { month: "long", year: "numeric" })}
                    </div>
                </div>

                <ShiftStatisticsTable year={year} month={month} />
                <ShiftHoursStatisticsTable year={year} month={month} />
                <SalaryStatisticsTable year={year} month={month} />
            </div>
        );
    }
);

export default function StatisticsPage() {
    const { control, setValue } = useForm<FormValues>({
        defaultValues: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        },
    });

    const watchedYear = useWatch({ control, name: "year" });
    const watchedMonth = useWatch({ control, name: "month" });

    const selectedYear = Number(watchedYear);
    const selectedMonth = Number(watchedMonth);

    const [direction, setDirection] = useState<number>(0);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const activeContentRef = useRef<HTMLDivElement | null>(null);

    const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');

    const measureHeight = useCallback(() => {
        const el = activeContentRef.current;
        if (!el) return;
        const h = Math.ceil(el.getBoundingClientRect().height);
        setContainerHeight(prev => (prev === h ? prev : h));
    }, []);

    useLayoutEffect(() => {
        requestAnimationFrame(measureHeight);
        const t = setTimeout(measureHeight, 350);
        return () => clearTimeout(t);
    }, [selectedYear, selectedMonth, measureHeight]);

    useLayoutEffect(() => {
        const el = activeContentRef.current;
        if (!el) return;
        const obs = new ResizeObserver(() => {
            requestAnimationFrame(measureHeight);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [measureHeight, selectedYear, selectedMonth]);

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({
            x: dir < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    const goToNext = useCallback(() => {
        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        setDirection(1);
        setValue("month", newMonth);
        setValue("year", newYear);
    }, [selectedMonth, selectedYear, setValue]);

    const goToPrev = useCallback(() => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setDirection(-1);
        setValue("month", newMonth);
        setValue("year", newYear);
    }, [selectedMonth, selectedYear, setValue]);

    const handleDragEnd = (event: PointerEvent | TouchEvent | MouseEvent, info: PanInfo) => {
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;

        if (Math.abs(offsetX) > SWIPE_OFFSET_THRESHOLD || Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
            if (offsetX < 0 || velocityX < 0) goToNext();
            else goToPrev();
        }
    };

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "ArrowRight") goToNext();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goToNext, goToPrev]);

    const hasMeasured = containerHeight !== 'auto';

    return (
        <div ref={wrapperRef} className="min-h-screen flex flex-col items-center bg-base-100 px-4 mb-20">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-5">Статистика</h1>

            <form className="flex gap-4 mb-6 flex-wrap justify-center">
                <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="number"
                            {...field}
                            className="input input-bordered w-32 mb-3"
                            min={1900}
                            max={2222}
                            placeholder="Год"
                        />
                    )}
                />

                <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                        <select {...field} className="select select-bordered w-32">
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("ru", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    )}
                />
            </form>

            <div
                className="w-full relative overflow-hidden rounded-box transition-[height] duration-300"
                style={hasMeasured ? { height: containerHeight } : undefined}
            >
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={`${selectedYear}-${selectedMonth}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={
                            hasMeasured
                                ? "absolute inset-0 w-full flex justify-center items-start"
                                : "relative w-full flex justify-center items-start"
                        }
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="w-full max-w-5xl">
                            <SlideContent ref={activeContentRef} year={selectedYear} month={selectedMonth} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
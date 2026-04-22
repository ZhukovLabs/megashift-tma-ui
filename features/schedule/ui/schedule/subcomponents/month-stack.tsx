"use client";

import { useEffect, useState } from "react";
import { motion, MotionValue, PanInfo } from "framer-motion";
import { MonthGrid } from "./month-grid";
import { useSchedule } from "../context";
import { DRAG_CONSTRAINTS_MULTIPLIER, DRAG_ELASTIC } from '@/features/schedule/model';

type DragProps = {
    y: MotionValue<number>;
    isAnimating: boolean;
    handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
};

type MonthStackProps = {
    dragProps: DragProps;
};

export const MonthStack = ({ dragProps }: MonthStackProps) => {
    const { nextMonth, prevMonth } = useSchedule();
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            setHeight(window.innerHeight);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const monthTypes = ["prev", "current", "next"] as const;

    return (
        <div className="relative flex-1 overflow-hidden">
            <motion.div
                drag={!dragProps.isAnimating ? "y" : false}
                dragElastic={DRAG_ELASTIC}
                dragMomentum={false}
                dragConstraints={{
                    top: -height * DRAG_CONSTRAINTS_MULTIPLIER,
                    bottom: 0,
                }}
                onDragEnd={dragProps.handleDragEnd}
                style={{ y: dragProps.y }}
                className="absolute inset-0 will-change-transform"
            >
                {monthTypes.map((type, index) => (
                    <div
                        key={index}
                        className="flex flex-col w-full h-screen"
                    >
                        <MonthGrid monthType={type} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

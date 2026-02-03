"use client";

import React, {useRef} from "react";
import {motion, PanInfo, MotionValue} from "framer-motion";
import {MonthGrid} from "./month-grid";
import {useSchedule} from "../context";
import {DRAG_CONSTRAINTS_MULTIPLIER, DRAG_ELASTIC} from "../config";

type DragProps = {
    y: MotionValue<number>;
    isAnimating: boolean;
    handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
};

type MonthStackProps = {
    dragProps: DragProps;
};

export const MonthStack = ({dragProps}: MonthStackProps) => {
    const {monthHeight} = useSchedule();
    const motionRef = useRef<HTMLDivElement>(null);

    const monthTypes = ["prev", "current", "next"] as const;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-base-200/40 shadow-inner flex-1">
            <motion.div
                ref={motionRef}
                drag={!dragProps.isAnimating ? "y" : false}
                dragElastic={DRAG_ELASTIC}
                dragMomentum={false}
                dragConstraints={{
                    top: -monthHeight * DRAG_CONSTRAINTS_MULTIPLIER,
                    bottom: 0,
                }}
                onDragEnd={dragProps.handleDragEnd}
                style={{y: dragProps.y}}
                className="absolute inset-0 will-change-transform"
            >
                {monthTypes.map((type, index) => (
                    <div key={index} style={{height: monthHeight}} className="pt-2 pb-2 px-2">
                        <MonthGrid monthType={type}/>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
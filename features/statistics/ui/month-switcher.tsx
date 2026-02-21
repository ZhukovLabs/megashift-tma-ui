'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';

const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 800;

const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

type MonthSwitcherProps = {
    year: number;
    month: number;
    onNext: VoidFunction;
    onPrev: VoidFunction;
    children: ReactNode;
};

export const MonthSwitcher = ({ year, month, onNext, onPrev, children }: MonthSwitcherProps) => {
    const [direction, setDirection] = useState(0);

    const handleDragEnd = useCallback(
        (_: unknown, info: PanInfo) => {
            const offsetX = info.offset.x;
            const velocityX = info.velocity.x;

            if (Math.abs(offsetX) > SWIPE_OFFSET_THRESHOLD || Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                if (offsetX < 0 || velocityX < 0) {
                    setDirection(1);
                    onNext();
                } else {
                    setDirection(-1);
                    onPrev();
                }
            }
        },
        [onNext, onPrev]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setDirection(-1);
                onPrev();
            }
            if (e.key === 'ArrowRight') {
                setDirection(1);
                onNext();
            }
        };

        window.addEventListener('keyup', onKey);
        return () => window.removeEventListener('keyup', onKey);
    }, [onNext, onPrev]);

    return (
        <div className="w-full relative rounded-box">
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                    key={`${year}-${month}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    className="relative w-full max-h-[70dvh] min-h-0 overflow-auto"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
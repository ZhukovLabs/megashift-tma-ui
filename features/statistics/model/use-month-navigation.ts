import {useCallback, useEffect, useState} from 'react';
import type {PanInfo} from 'framer-motion';

const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 800;

type Params = {
    initialYear?: number;
    initialMonth?: number;
};

export const useMonthNavigation = ({
                                       initialYear = new Date().getFullYear(),
                                       initialMonth = new Date().getMonth() + 1,
                                   }: Params = {}) => {
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [direction, setDirection] = useState(0);

    const goTo = useCallback((delta: number) => {
        const date = new Date(year, month - 1 + delta, 1);
        const newYear = date.getFullYear();
        const newMonth = date.getMonth() + 1;

        setDirection(Math.sign(delta));
        setYear(newYear);
        setMonth(newMonth);
    }, [year, month]);

    const goToNext = useCallback(() => goTo(1), [goTo]);
    const goToPrev = useCallback(() => goTo(-1), [goTo]);

    const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
        const {offset, velocity} = info;

        if (
            Math.abs(offset.x) > SWIPE_OFFSET_THRESHOLD ||
            Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD
        ) {
            if (offset.x < 0 || velocity.x < 0) goToNext();
            else goToPrev();
        }
    }, [goToNext, goToPrev]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
        };

        window.addEventListener('keyup', onKey);
        return () => window.removeEventListener('keyup', onKey);
    }, [goToNext, goToPrev]);

    return {
        year,
        month,
        direction,
        setYear,
        setMonth,
        goToNext,
        goToPrev,
        handleDragEnd,
    };
}
"use client";

import ShiftCard from "@/features/shift/ui/shift-card";
import {ShiftsListSkeleton} from "./skeleton";
import {EmptyState} from "./empty-list";
import {formatInTimeZone} from "date-fns-tz";
import {useUserStore} from "@/entities/user";
import {motion, AnimatePresence} from "framer-motion";

type Shift = {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    color?: string;
};

type Props = {
    shifts: Shift[];
    isLoading: boolean;
    onCreateClick?: VoidFunction;
    onOpenShift?: (shift: Shift) => void;
    onDeleteShift?: (shift: Shift) => void;
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ShiftsList({
                                       shifts,
                                       isLoading,
                                       onCreateClick,
                                       onOpenShift,
                                       onDeleteShift,
                                   }: Props) {
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');
    const isEmpty = !isLoading && shifts.length === 0;

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="skeleton" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <ShiftsListSkeleton/>
                    </motion.div>
                ) : isEmpty ? (
                    <motion.div key="empty" initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}}>
                        <EmptyState onCreateClick={onCreateClick}/>
                    </motion.div>
                ) : (
                    <motion.ul 
                        key="list"
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4 pb-32" 
                        role="list"
                    >
                        {shifts.map((shift) => (
                            <motion.div key={shift.id} variants={item}>
                                <ShiftCard
                                    label={shift.label}
                                    startTime={formatInTimeZone(shift.startTime, tz, 'HH:mm')}
                                    endTime={formatInTimeZone(shift.endTime, tz, 'HH:mm')}
                                    color={shift.color}
                                    onClick={() => onOpenShift?.(shift)}
                                    onDelete={() => onDeleteShift?.(shift)}
                                />
                            </motion.div>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

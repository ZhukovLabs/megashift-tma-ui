"use client";

import ShiftCard from "@/features/shift/ui/shift-card";
import {ShiftsListSkeleton} from "./skeleton";
import {EmptyState} from "./empty-list";
import {formatInTimeZone} from "date-fns-tz";
import {useUserStore} from "@/entities/user";
import {motion} from "framer-motion";

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
            {isLoading && <ShiftsListSkeleton/>}
            {isEmpty && <EmptyState onCreateClick={onCreateClick}/>}

            {!isLoading && !isEmpty && (
                <motion.ul 
                    initial={false}
                    className="flex flex-col gap-3 pb-32" 
                    role="list"
                >
                    {shifts.map((shift, i) => (
                        <ShiftCard
                            key={shift.id}
                            label={shift.label}
                            startTime={formatInTimeZone(shift.startTime, tz, 'HH:mm')}
                            endTime={formatInTimeZone(shift.endTime, tz, 'HH:mm')}
                            color={shift.color}
                            onClick={() => onOpenShift?.(shift)}
                            onDelete={() => onDeleteShift?.(shift)}
                        />
                    ))}
                </motion.ul>
            )}
        </div>
    );
}

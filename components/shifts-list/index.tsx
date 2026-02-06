"use client";

import ShiftCard from "@/components/shift-card";
import {ShiftsListSkeleton} from "./skeleton";
import {EmptyState} from "./empty-list";

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

function formatTimeRange(shift: Shift) {
    return {
        start: shift.startTime.slice(11, 16),
        end: shift.endTime.slice(11, 16),
    };
}

export default function ShiftsList({
                                       shifts,
                                       isLoading,
                                       onCreateClick,
                                       onOpenShift,
                                       onDeleteShift,
                                   }: Props) {
    const isEmpty = !isLoading && shifts.length === 0;

    return (
        <div className="relative w-full max-w-xl rounded-2xl overflow-hidden">
            <div
                className="relative h-[80vh] max-h-[80vh] overflow-auto p-2 pr-4"
                style={{WebkitOverflowScrolling: "touch"}}
            >
                {isLoading && <ShiftsListSkeleton/>}
                {isEmpty && <EmptyState onCreateClick={onCreateClick}/>}

                {!isLoading && !isEmpty && (
                    <ul className="flex flex-col gap-4 pb-8" role="list">
                        {shifts.map((shift) => {
                            const {start, end} = formatTimeRange(shift);

                            return (
                                <ShiftCard
                                    key={shift.id}
                                    label={shift.label}
                                    startTime={start}
                                    endTime={end}
                                    color={shift.color}
                                    onClick={() => onOpenShift?.(shift)}
                                    onDelete={() => onDeleteShift?.(shift)}
                                />
                            );
                        })}
                    </ul>
                )}
            </div>

            <TopFade/>
            <BottomFade/>
        </div>
    );
}


const TopFade = () => (
    <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-8 rounded-t-2xl bg-gradient-to-b from-base-100 via-base-100/50 to-transparent"/>
)

const BottomFade = () => (
    <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl bg-gradient-to-t from-base-100 via-base-100/50 to-transparent"/>
)
"use client";

import React from "react";
import ShiftCard from "@/components/shift-card";
import { Plus } from "lucide-react";

type Shift = {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    color?: string;
};

type Props = {
    shifts?: Shift[] | null;
    isLoading?: boolean;
    onCreateClick?: () => void;
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
    return (
        <div className="relative w-full max-w-xl rounded-2xl">
            <div className="overflow-auto h-[80vh] max-h-[80vh] p-6 relative" style={{ WebkitOverflowScrolling: "touch" }}>
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse p-5 bg-base-100 rounded-lg shadow-sm" />
                        ))}
                    </div>
                ) : shifts && shifts.length > 0 ? (
                    <ul className="flex flex-col gap-4" role="list">
                        {shifts.map((shift) => {
                            const start = shift.startTime.slice(11, 16);
                            const end = shift.endTime.slice(11, 16);

                            return (
                                <li key={shift.id}>
                                    <ShiftCard
                                        label={shift.label}
                                        startTime={start}
                                        endTime={end}
                                        color={shift.color}
                                        onClick={() => onOpenShift?.(shift)}
                                        onDelete={() => onDeleteShift?.(shift)}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <p className="text-base-content/60 text-center px-4">
                            Сейчас смен нет — добавьте первую смену!
                        </p>
                        <button
                            onClick={onCreateClick}
                            className="flex items-center justify-center w-16 h-16 bg-primary text-primary-content rounded-full shadow-md hover:shadow-lg transition"
                            aria-label="Добавить смену"
                        >
                            <Plus strokeWidth={2.5} size={24} />
                        </button>
                    </div>
                )}

                <div className="h-8" />
            </div>

            {/* плавный переход сверху */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-base-100 via-base-100/50 to-transparent rounded-t-2xl" />
            {/* плавный переход снизу */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-base-100 via-base-100/50 to-transparent rounded-b-2xl" />
        </div>
    );
}

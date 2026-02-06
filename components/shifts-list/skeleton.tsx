import React from "react";

const SKELETON_COUNT = 3;

export const ShiftsListSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({length: SKELETON_COUNT}).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-lg bg-base-100 p-5 shadow-sm h-[84]"
                />
            ))}
        </div>
    );
}
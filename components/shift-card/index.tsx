"use client";

import {motion} from "framer-motion";
import {Trash2} from "lucide-react";

interface ShiftCardProps {
    label: string;
    startTime: string;
    endTime: string;
    color?: string;
    onClick: VoidFunction;
    onDelete: VoidFunction;
}

export default function ShiftCard({
                                      label,
                                      startTime,
                                      endTime,
                                      color,
                                      onClick,
                                      onDelete,
                                  }: ShiftCardProps) {
    return (
        <motion.li
            layout
            whileHover={{scale: 1.02}}
            transition={{type: "spring", stiffness: 300, damping: 25}}
            onClick={onClick}
            className="relative rounded-xl cursor-pointer border-l-4 p-4 bg-base-100 flex items-center justify-between shadow-md overflow-hidden"
            style={{borderColor: color || "#3b82f6"}}
        >
            <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-lg text-base-content truncate">
                    {label}
                </h2>
                <p className="text-sm text-base-content/70">
                    {startTime} - {endTime}
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                type="button"
                aria-label={`Удалить смену ${label}`}
                className="flex items-center justify-center p-1 rounded-full text-red-500 hover:text-red-700 transition-all cursor-pointer"
            >
                <Trash2 size={24} strokeWidth={2}/>
            </button>
        </motion.li>
    );
}

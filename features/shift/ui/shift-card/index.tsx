"use client";

import {motion} from "framer-motion";
import {Trash2, Clock, ChevronRight} from "lucide-react";
import cn from "classnames";

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
                                      color = "#3b82f6",
                                      onClick,
                                      onDelete,
                                  }: ShiftCardProps) {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative rounded-[28px] cursor-pointer bg-base-100 p-1.5 pr-4 flex items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-base-200 hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
            <div 
                className="w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner bg-base-200/50"
            >
                <div 
                    className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}30`
                    }} 
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <h2 className="font-bold text-lg text-base-content/90 truncate leading-tight tracking-tight">
                    {label}
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/25 uppercase tracking-widest">
                    <Clock size={12} strokeWidth={3} className="text-primary/20" />
                    <span>{startTime} — {endTime}</span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-error/5 text-error/30 hover:bg-error hover:text-white transition-all duration-200"
                >
                    <Trash2 size={18} strokeWidth={2.5}/>
                </button>
                <ChevronRight size={18} className="text-base-content/5 group-hover:text-primary/20 transition-colors" />
            </div>
        </motion.li>
    );
}

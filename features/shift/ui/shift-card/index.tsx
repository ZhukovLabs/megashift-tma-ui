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
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            whileTap={{scale: 0.97}}
            onClick={onClick}
            className="group relative rounded-[32px] cursor-pointer bg-base-100 p-1.5 pr-4 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-200/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/10 transition-all duration-300"
        >
            <div 
                className="w-16 h-16 rounded-[26px] flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden"
                style={{backgroundColor: `${color}10`}}
            >
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 50%)`
                    }}
                />
                <div 
                    className="w-4 h-4 rounded-full shadow-lg relative z-10" 
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}60`
                    }} 
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h2 className="font-black text-lg text-base-content truncate leading-tight tracking-tight">
                    {label}
                </h2>
                <div className="flex items-center gap-2 text-[13px] font-bold text-base-content/30 uppercase tracking-widest">
                    <Clock size={14} className="text-primary/40" />
                    <span>{startTime} — {endTime}</span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-base-200/50 text-base-content/20 hover:bg-error/10 hover:text-error active:scale-90 transition-all"
                >
                    <Trash2 size={18} strokeWidth={2.5}/>
                </button>
                <ChevronRight size={20} className="text-base-content/10 group-hover:text-primary/30 transition-colors" />
            </div>
        </motion.li>
    );
}

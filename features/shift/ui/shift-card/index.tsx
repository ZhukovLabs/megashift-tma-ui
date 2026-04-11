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
            className="group relative rounded-[32px] cursor-pointer bg-base-100 p-2 pr-5 flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-base-200/40 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-primary/20 transition-all duration-500 overflow-hidden"
        >
            {/* Фоновое свечение при наведении */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 0% 50%, ${color} 0%, transparent 70%)`
                }}
            />

            <div 
                className="w-16 h-16 rounded-[26px] flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden bg-base-200/20"
            >
                <div 
                    className="absolute inset-0 opacity-30 group-hover:scale-110 transition-transform duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${color}30 0%, transparent 100%)`
                    }}
                />
                <div 
                    className="w-5 h-5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] relative z-10 transition-transform group-hover:scale-110 duration-300" 
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 25px ${color}50`
                    }} 
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-0.5 relative z-10">
                <h2 className="font-black text-xl text-base-content truncate leading-tight tracking-tighter group-hover:text-primary transition-colors">
                    {label}
                </h2>
                <div className="flex items-center gap-2 text-[12px] font-black text-base-content/20 uppercase tracking-[0.15em] transition-colors group-hover:text-base-content/40">
                    <Clock size={12} strokeWidth={3} className="text-primary/30" />
                    <span>{startTime} — {endTime}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-base-200/30 text-base-content/20 hover:bg-error/10 hover:text-error active:scale-90 transition-all"
                >
                    <Trash2 size={18} strokeWidth={2.5}/>
                </button>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/5 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ChevronRight size={18} strokeWidth={3} />
                </div>
            </div>
        </motion.li>
    );
}

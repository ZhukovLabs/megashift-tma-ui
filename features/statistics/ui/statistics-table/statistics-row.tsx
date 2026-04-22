import type {StatisticItem} from "./index";
import {calculatePercentage} from "../../model/calculate-percentage";
import {motion, AnimatePresence} from "framer-motion";
import {CheckCircle2} from "lucide-react";
import cn from "classnames";

type Props = {
    item: StatisticItem;
    total: number;
    formatNumber: (n: number) => string;
    onToggle?: () => void;
};

export const StatisticsRow = ({ item, total, formatNumber, onToggle }: Props) => {
    const pct = calculatePercentage(item.value, total);
    const color = item.color || "#3b82f6";

    return (
        <motion.div
            layout
            onClick={onToggle}
            className={cn(
                "group relative p-5 rounded-[32px] border transition-all duration-500 select-none",
                onToggle ? "cursor-pointer" : "cursor-default",
                "bg-base-100 border-base-200/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:border-primary/20"
            )}
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                    {/* Status Circle */}
                    <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
                        style={{ backgroundColor: `${color}15`, color }}
                    >
                        <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ 
                                backgroundColor: color, 
                                boxShadow: `0 0 10px ${color}40` 
                            }} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-base-content/90">
                            {item.label}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/25">
                            Category stats
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xl font-black tabular-nums tracking-tighter text-base-content">
                        {formatNumber(item.value)}
                    </span>
                    <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1"
                        style={{ backgroundColor: `${color}10`, color }}
                    >
                        {pct.toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Progress Bar Area */}
            <div className="relative h-2 w-full bg-base-200/40 rounded-full overflow-hidden z-10">
                 <motion.div
                    className="h-full rounded-full"
                    style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 20px ${color}30`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>

            {/* Subtle background glow */}
            <div 
                className="absolute -right-4 -top-4 w-24 h-24 blur-[60px] opacity-[0.05] rounded-full pointer-events-none"
                style={{ backgroundColor: color }}
            />
            
            {/* Feedback on tap (if clickable) */}
            {onToggle && (
                <motion.div
                    className="absolute inset-0 bg-base-content/5 opacity-0 rounded-[32px]"
                    whileTap={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                />
            )}
        </motion.div>
    );
};

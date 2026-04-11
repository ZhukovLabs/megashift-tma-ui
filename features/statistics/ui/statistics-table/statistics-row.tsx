import type {StatisticItem} from "./index";
import {calculatePercentage} from "../../model/calculate-percentage";
import {motion} from "framer-motion";

type Props = {
    item: StatisticItem;
    total: number;
    formatNumber: (n: number) => string;
};

export const StatisticsRow = ({ item, total, formatNumber }: Props) => {
    const pct = calculatePercentage(item.value, total);
    const color = item.color || "#3b82f6";

    return (
        <div
            key={item.id}
            className="group relative overflow-hidden rounded-[24px] bg-base-100 border border-base-200/60 p-4 transition-all hover:border-primary/20 active:scale-[0.98]"
        >
            <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{backgroundColor: `${color}15`, color: color}}
                    >
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: color, boxShadow: `0 0 10px ${color}40`}} />
                    </div>
                    <span className="font-bold text-base text-base-content/90 truncate leading-tight tracking-tight">
                        {item.label}
                    </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className="text-base font-black text-base-content leading-none">
                        {formatNumber(item.value)}
                    </span>
                    <span className="text-[10px] font-black text-base-content/20 uppercase tracking-widest mt-1">
                        {pct.toFixed(0)}%
                    </span>
                </div>
            </div>

            <div className="h-1.5 bg-base-200/50 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}30`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                />
            </div>
        </div>
    );
};

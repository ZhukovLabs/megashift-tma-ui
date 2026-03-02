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

    return (
        <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-base-100 border border-base-200"
        >
            {item.color && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: item.color }} aria-hidden />}
            <div className="flex items-center justify-between gap-3 p-3 pl-6">
                <div className="flex flex-col flex-1">
                    <span className="font-medium">{item.label}</span>
                    <div className="mt-1.5 h-1.5 bg-base-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>
                <span className="px-3 py-0.5 rounded-full bg-base-200 font-semibold text-sm">
                    {formatNumber(item.value)}
                </span>
            </div>
        </div>
    );
};
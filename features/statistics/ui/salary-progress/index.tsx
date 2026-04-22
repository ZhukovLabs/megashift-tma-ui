'use client';

import {motion} from 'framer-motion';
import {salaryTypeConfig} from "./config";
import {SalaryType} from "@/entities/salary/model/types";
import {calculateSalaryPercentage} from "@/features/statistics/model/calculate-salary-percentage";
import {formatMoney} from "@/shared/lib/format/format-money";
import {LoaderLarge} from "@/shared/ui/loader-large";
import {TrendingUp, Settings2} from 'lucide-react';

type SalaryProgressProps = {
    typeSalary: SalaryType;
    salary: number;
    maxSalary?: number;
    currencySymbol?: string;
    isLoading?: boolean;
    salaryTypeLabel?: string;
    onOpenSettings?: () => void;
};

export const SalaryProgress = ({typeSalary, salary, maxSalary, currencySymbol, isLoading, salaryTypeLabel, onOpenSettings}: SalaryProgressProps) => {
    if (isLoading) {
        return <LoaderLarge/>
    }

    const {color} = salaryTypeConfig[typeSalary];
    const label = salaryTypeLabel || salaryTypeConfig[typeSalary].label;
    const pct = calculateSalaryPercentage(salary, maxSalary);

    return (
        <div className="w-full flex flex-col items-center">
            {onOpenSettings && (
                <button 
                    onClick={onOpenSettings}
                    className="absolute top-0 right-0 w-8 h-8 rounded-xl bg-base-200/50 flex items-center justify-center text-base-content/30 active:scale-90 active:bg-primary/10 active:text-primary transition-all group"
                >
                    <Settings2 size={16} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform duration-500" />
                </button>
            )}
            <div className="relative w-48 h-48 mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg] drop-shadow-sm">
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth="2.5"
                    />
                    <motion.circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        animate={{strokeDashoffset: 100 - pct}}
                        transition={{duration: 1.5, ease: [0.34, 1.56, 0.64, 1]}}
                        style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-primary/5 p-2 rounded-full mb-2">
                        <TrendingUp size={16} className="text-primary" />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-base-content tracking-tighter leading-none">
                            {formatMoney(salary, "").trim()}
                        </span>
                        {currencySymbol && (
                            <span className="text-sm font-black text-primary uppercase">
                                {currencySymbol}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mt-2">
                        {label}
                    </span>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-base-100 rounded-2xl p-3 border border-base-200/60 shadow-sm flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-base-content/20 mb-1">Минимум</span>
                    <span className="text-sm font-bold text-base-content/60">{formatMoney(0, currencySymbol)}</span>
                </div>
                <div className="bg-base-100 rounded-2xl p-3 border border-base-200/60 shadow-sm flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-base-content/20 mb-1">Цель</span>
                    <span className="text-sm font-bold text-base-content/60">{formatMoney(maxSalary ?? 0, currencySymbol)}</span>
                </div>
            </div>
        </div>
    );
};

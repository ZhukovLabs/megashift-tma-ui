'use client';

import {motion} from 'framer-motion';
import {salaryTypeConfig} from "./config";
import {SalaryType} from "@/entities/salary/model/types";
import {calculateSalaryPercentage} from "@/features/statistics/model/calculate-salary-percentage";
import {formatMoney} from "@/shared/lib/format/format-money";
import {LoaderLarge} from "@/shared/ui/loader-large";

type SalaryProgressProps = {
    typeSalary: SalaryType;
    salary: number;
    maxSalary: number;
    currencySymbol?: string;
    isLoading?: boolean;
    salaryTypeLabel?: string;
};

export const SalaryProgress = ({typeSalary, salary, maxSalary, currencySymbol, isLoading, salaryTypeLabel}: SalaryProgressProps) => {
    if (isLoading) {
        return <LoaderLarge/>
    }

    const {color} = salaryTypeConfig[typeSalary];
    const label = salaryTypeLabel || salaryTypeConfig[typeSalary].label;
    const pct = calculateSalaryPercentage(salary, maxSalary);

    return (
        <div
            className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-200">
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                    />
                    <motion.circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        animate={{strokeDashoffset: 100 - pct}}
                        transition={{duration: 1, ease: 'easeOut'}}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="text-xl font-bold text-base-content">{formatMoney(salary, currencySymbol)}</span>
                    <span className="text-sm text-base-content/70">{label}</span>
                </div>
            </div>

            <div className="flex justify-between w-full mt-4 text-xs text-base-content/50">
                <span>{formatMoney(0, currencySymbol)}</span>
                <span>{formatMoney(maxSalary, currencySymbol)}</span>
            </div>
        </div>
    );
};

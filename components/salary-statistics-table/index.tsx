'use client';

import React, {useMemo} from 'react';
import {useGetSalaryStatistics} from '@/api-hooks/use-get-salary-statistics';
import {format} from 'date-fns';
import {motion} from 'framer-motion';

type SalaryDonutCardProps = {
    year: number;
    month: number;
    maxSalary?: number;
};

export const SalaryStatisticsTable = ({year, month}: SalaryDonutCardProps) => {
    const {data, isLoading} = useGetSalaryStatistics(year, month);

    const salary = data?.salary ?? 0;
    const maxSalary = data?.maxSalary ?? 1;
    const typeLabel = useMemo(() => {
        if (!data) return '';
        switch (data.typeSalary) {
            case 'HOURLY':
                return 'Почасовая';
            case 'SHIFT':
                return 'Посменная';
            case 'MONTHLY':
                return 'Месячная';
            default:
                return 'Неизвестно';
        }
    }, [data]);

    const pct = Math.min(100, (salary / maxSalary) * 100);
    const donutColor = useMemo(() => {
        switch (data?.typeSalary) {
            case 'HOURLY':
                return '#facc15';
            case 'SHIFT':
                return '#4ade80';
            case 'MONTHLY':
                return '#60a5fa';
            default:
                return '#cbd5e1';
        }
    }, [data?.typeSalary]);

    const dateLabel = format(new Date(year, month - 1, 1), 'MM.yyyy');

    return (
        <div
            className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-200">
            <h2 className="text-base-content/70 font-semibold text-sm">{dateLabel}</h2>

            {isLoading ? (
                <div className="py-8 text-center text-base-content/50">Загрузка...</div>
            ) : (
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
                            stroke={donutColor}
                            strokeWidth="3"
                            strokeDasharray="100"
                            strokeDashoffset="100"
                            animate={{strokeDashoffset: 100 - pct}}
                            transition={{duration: 1, ease: 'easeOut'}}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-base-content">{salary.toLocaleString()} ₽</span>
                        <span className="text-sm text-base-content/70">{typeLabel}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between w-full mt-4 text-xs text-base-content/50">
                <span>0 ₽</span>
                <span>{maxSalary.toLocaleString()} ДЕНЯК</span>
            </div>
        </div>
    );
};

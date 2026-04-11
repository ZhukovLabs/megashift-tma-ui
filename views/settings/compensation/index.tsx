'use client';

import React, {useEffect, useMemo} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {useUpdateSalary, useGetUserSettings} from '@/features/user/api';
import {SalaryType} from '@/entities/salary';
import {Banknote, Target, ChevronDown} from 'lucide-react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {CURRENCIES, Currency} from "@/entities/currency";
import {motion, AnimatePresence} from "framer-motion";

const currencyValues = CURRENCIES.map(
    (c) => c.value
) as [Currency, ...Currency[]];

const SALARY_LABELS: Record<SalaryType, string> = {
    HOURLY: 'Час',
    SHIFT: 'Смена',
    MONTHLY: 'Месяц',
    UNKNOWN: 'Неизвестно',
};

const SALARY_FULL_LABELS: Record<SalaryType, string> = {
    HOURLY: 'Ставка в час',
    SHIFT: 'Ставка за смену',
    MONTHLY: 'Месячная зарплата',
    UNKNOWN: 'Неизвестно',
};

const schema = z
    .object({
        typeSalary: z.enum(['HOURLY', 'SHIFT', 'MONTHLY']),
        salary: z.number().min(0, 'Введите корректную сумму'),
        maxSalary: z.union([z.number(), z.nan()]).optional().transform(v => (v === undefined || isNaN(v)) ? undefined : v),
        currency: z.enum(currencyValues),
    })
    .refine(
        (data) =>
            data.maxSalary === undefined ||
            data.maxSalary >= data.salary,
        {
            message: 'Цель не может быть меньше основной ставки',
            path: ['maxSalary'],
        }
    );

type FormValues = z.infer<typeof schema>;

export function CompensationSettingsPage() {
    const {data: settings, isLoading} = useGetUserSettings();
    const mutation = useUpdateSalary();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid},
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            typeSalary: SalaryType.MONTHLY,
            salary: 0,
            maxSalary: undefined,
            currency: 'RUB',
        },
    });

    const typeSalary = useWatch({control, name: 'typeSalary'});
    const currency = useWatch({control, name: 'currency'});

    const selectedCurrency = useMemo(
        () => CURRENCIES.find((c) => c.value === currency),
        [currency]
    );

    useEffect(() => {
        if (!settings) return;

        const ts = settings.typeSalary === SalaryType.UNKNOWN 
            ? SalaryType.MONTHLY 
            : settings.typeSalary;

        reset({
            typeSalary: (ts as any) ?? SalaryType.MONTHLY,
            salary: settings.salary ?? 0,
            maxSalary: settings.maxSalary ?? undefined,
            currency: (settings.currency as Currency) ?? 'RUB',
        });
    }, [settings, reset]);

    const onSubmit = (data: FormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <h1 className="text-xl font-black tracking-tight text-base-content leading-none">
                        Оплата труда
                    </h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/25 mt-1.5 leading-none">
                        Параметры дохода
                    </p>
                </div>
            </header>

            <main className="w-full px-6 max-w-xl mx-auto pt-6 pb-32">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Метод расчета */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">Метод расчета</label>
                        <div className="bg-base-200/40 p-1 rounded-2xl border border-base-200/60 relative">
                            <Controller
                                name="typeSalary"
                                control={control}
                                render={({field}) => (
                                    <div className="grid grid-cols-3 relative z-10">
                                        {(['HOURLY', 'SHIFT', 'MONTHLY'] as SalaryType[]).map((type) => {
                                            const active = field.value === type;
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => field.onChange(type)}
                                                    className="relative py-2.5 text-[10px] font-black uppercase tracking-wider outline-none"
                                                >
                                                    {active && (
                                                        <motion.div 
                                                            layoutId="active-pill-comp"
                                                            className="absolute inset-0 bg-base-100 rounded-xl shadow-sm ring-1 ring-base-200/50"
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                        />
                                                    )}
                                                    <span className={cn(
                                                        "relative z-20 transition-colors duration-300",
                                                        active ? "text-primary" : "text-base-content/40"
                                                    )}>
                                                        {SALARY_LABELS[type]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Основная ставка */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">
                            {SALARY_FULL_LABELS[typeSalary]}
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-base-content/20 group-focus-within:text-primary transition-colors">
                                    <Banknote size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-base-200/30 border-2 border-transparent focus:border-primary/10 focus:bg-base-100 transition-all text-lg font-bold outline-none shadow-inner"
                                    placeholder="0"
                                    disabled={isLoading}
                                    {...register('salary', {valueAsNumber: true})}
                                />
                            </div>

                            <div className="relative group">
                                <select
                                    className="h-14 w-24 pl-4 pr-8 rounded-2xl bg-base-200/30 border-2 border-transparent focus:border-primary/10 focus:bg-base-100 transition-all text-base font-bold outline-none appearance-none shadow-inner cursor-pointer"
                                    disabled={isLoading}
                                    {...register('currency')}
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.symbol}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-base-content/20">
                                    <ChevronDown size={16} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                        {errors.salary && <p className="text-error text-[10px] font-bold ml-4">{errors.salary.message}</p>}
                    </div>

                    {/* Финансовая цель */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">Финансовая цель (опционально)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-base-content/20 group-focus-within:text-primary transition-colors">
                                <Target size={18} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                step="any"
                                className="w-full h-14 pl-12 pr-12 rounded-2xl bg-base-200/30 border-2 border-transparent focus:border-primary/10 focus:bg-base-100 transition-all text-lg font-bold outline-none shadow-inner"
                                placeholder="Не установлена"
                                disabled={isLoading}
                                {...register('maxSalary', {valueAsNumber: true})}
                            />
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <span className="text-base font-bold text-base-content/20">{selectedCurrency?.symbol}</span>
                            </div>
                        </div>
                        {errors.maxSalary && <p className="text-error text-[10px] font-bold ml-4">{errors.maxSalary.message}</p>}
                    </div>

                    {/* Кнопка сохранения */}
                    <button
                        type="submit"
                        disabled={!isValid || mutation.isPending || isLoading}
                        className="btn btn-primary w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            </main>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

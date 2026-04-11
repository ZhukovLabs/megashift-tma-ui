'use client';

import React, {useEffect, useMemo} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {useUpdateSalary, useGetUserSettings} from '@/features/user/api';
import {SalaryType} from '@/entities/salary';
import {DollarSign, CalendarDays, Wallet, Banknote, Target} from 'lucide-react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {CURRENCIES, Currency} from "@/entities/currency";
import {motion} from "framer-motion";

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

        const typeSalary = settings.typeSalary === SalaryType.UNKNOWN 
            ? SalaryType.MONTHLY 
            : settings.typeSalary;

        reset({
            typeSalary: (typeSalary as any) ?? SalaryType.MONTHLY,
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
                    <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                        Оплата труда
                    </h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/20 mt-1.5 leading-none">
                        Финансовые настройки
                    </p>
                </div>
            </header>

            <main className="w-full px-4 max-w-xl mx-auto pt-6 pb-32">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Тип оплаты */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Метод расчета</label>
                        <div className="bg-base-200/40 p-1 rounded-[24px] border border-base-200/50">
                            <Controller
                                name="typeSalary"
                                control={control}
                                render={({field}) => (
                                    <div className="grid grid-cols-3 gap-1">
                                        {(['HOURLY', 'SHIFT', 'MONTHLY'] as SalaryType[]).map((type) => {
                                            const active = field.value === type;
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => field.onChange(type)}
                                                    className={`rounded-[20px] py-3 text-xs font-black uppercase tracking-tight transition-all
                                                        ${active ? 'bg-base-100 text-primary shadow-sm ring-1 ring-base-200' : 'text-base-content/40 hover:text-base-content/60'}`}
                                                >
                                                    {SALARY_LABELS[type]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    </motion.div>

                    {/* Основная ставка */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">
                            {SALARY_FULL_LABELS[typeSalary]}
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-base-content/20 group-focus-within:text-primary/40 transition-colors">
                                    <Banknote size={20} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full h-16 pl-14 pr-6 rounded-[28px] bg-base-200/40 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-xl font-black outline-none shadow-inner"
                                    placeholder="0"
                                    disabled={isLoading}
                                    {...register('salary', {valueAsNumber: true})}
                                />
                            </div>

                            <div className="relative group">
                                <select
                                    className="h-16 w-24 px-4 rounded-[28px] bg-base-200/40 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-lg font-black outline-none appearance-none text-center shadow-inner"
                                    disabled={isLoading}
                                    {...register('currency')}
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.symbol}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-base-content/10">
                                    <div className="w-px h-6 bg-current" />
                                </div>
                            </div>
                        </div>
                        {errors.salary && <p className="text-error text-[10px] font-bold ml-4">{errors.salary.message}</p>}
                    </motion.div>

                    {/* Максимальная сумма */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Финансовая цель (опционально)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-base-content/20 group-focus-within:text-primary/40 transition-colors">
                                <Target size={20} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                step="any"
                                className="w-full h-16 pl-14 pr-16 rounded-[28px] bg-base-200/40 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-xl font-black outline-none shadow-inner"
                                placeholder="Не установлена"
                                disabled={isLoading}
                                {...register('maxSalary', {valueAsNumber: true})}
                            />
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                                <span className="text-lg font-black text-base-content/20">{selectedCurrency?.symbol}</span>
                            </div>
                        </div>
                        {errors.maxSalary && <p className="text-error text-[10px] font-bold ml-4">{errors.maxSalary.message}</p>}
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        type="submit"
                        disabled={!isValid || mutation.isPending || isLoading}
                        className="btn btn-primary w-full h-16 rounded-[28px] text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-all"
                    >
                        {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </motion.button>
                </form>
            </main>
        </div>
    );
}

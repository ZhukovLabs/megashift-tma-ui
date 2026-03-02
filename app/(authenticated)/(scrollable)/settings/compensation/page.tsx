'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
    useUpdateSalary,
    useGetUserSettings,
    SalaryType,
} from '@/api-hooks/user/setting';
import { DollarSign, CalendarDays, Wallet } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {CURRENCIES, Currency} from "@/entities/currency";

const currencyValues = CURRENCIES.map(
    (c) => c.value
) as [Currency, ...Currency[]];

const SALARY_LABELS: Record<SalaryType, string> = {
    HOURLY: 'Час',
    SHIFT: 'Смена',
    MONTHLY: 'Месяц',
};

const SALARY_FULL_LABELS: Record<SalaryType, string> = {
    HOURLY: 'Ставка в час',
    SHIFT: 'Ставка за смену',
    MONTHLY: 'Месячная зарплата',
};

const schema = z
    .object({
        typeSalary: z.nativeEnum(SalaryType),
        salary: z.number().min(0, 'Введите корректную сумму'),
        maxSalary: z.number().min(0).optional(),
        currency: z.enum(currencyValues),
    })
    .refine(
        (data) =>
            data.maxSalary === undefined ||
            data.maxSalary >= data.salary,
        {
            message: 'Максимальная сумма меньше основной',
            path: ['maxSalary'],
        }
    );

type FormValues = z.infer<typeof schema>;

export default function CompensationPage() {
    const { data: settings, isLoading } = useGetUserSettings();
    const mutation = useUpdateSalary();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
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

    const typeSalary = useWatch({ control, name: 'typeSalary' });
    const currency = useWatch({ control, name: 'currency' });

    const selectedCurrency = useMemo(
        () => CURRENCIES.find((c) => c.value === currency),
        [currency]
    );

    useEffect(() => {
        if (!settings) return;

        reset({
            typeSalary: settings.typeSalary ?? SalaryType.MONTHLY,
            salary: settings.salary ?? 0,
            maxSalary: settings.maxSalary ?? undefined,
            currency: (settings.currency as Currency) ?? 'RUB',
        });
    }, [settings, reset]);

    const onSubmit = (data: FormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-base-200 pb-12">
            <div className="mx-auto w-full max-w-md px-4 pt-7">
                <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-base-content/90">
                    Оплата труда
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Тип оплаты */}
                    <div className="rounded-2xl bg-base-100 shadow-sm">
                        <div className="px-5 pt-5 pb-6">
                            <div className="mb-3 flex items-center gap-2.5 text-sm font-medium text-base-content/70">
                                <Wallet size={17} />
                                <span>Тип оплаты</span>
                            </div>

                            <Controller
                                name="typeSalary"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.values(SalaryType).map((type) => {
                                            const active = field.value === type;
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => field.onChange(type)}
                                                    className={`rounded-xl py-2.5 text-sm font-medium transition-all
                          ${
                                                        active
                                                            ? 'bg-primary text-primary-content shadow-sm'
                                                            : 'bg-base-200/70 hover:bg-base-200 text-base-content/80'
                                                    }`}
                                                >
                                                    {SALARY_LABELS[type]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Сумма + валюта */}
                    <div className="rounded-2xl bg-base-100 shadow-sm">
                        <div className="px-5 pt-5 pb-6 space-y-4">
                            <div className="flex items-center gap-2.5 text-sm font-medium text-base-content/70">
                                <DollarSign size={17} />
                                <span>{SALARY_FULL_LABELS[typeSalary]}</span>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min={0}
                                        step="any"
                                        className="input input-bordered w-full text-lg"
                                        placeholder="0"
                                        disabled={isLoading}
                                        {...register('salary', { valueAsNumber: true })}
                                    />
                                    {errors.salary && (
                                        <p className="text-error text-xs mt-1">
                                            {errors.salary.message}
                                        </p>
                                    )}
                                </div>

                                <select
                                    className="select select-bordered w-24 text-base"
                                    disabled={isLoading}
                                    {...register('currency')}
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.symbol}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Максимальная сумма */}
                    <div className="rounded-2xl bg-base-100 shadow-sm">
                        <div className="px-5 pt-5 pb-6">
                            <div className="mb-3 flex items-center gap-2.5 text-sm font-medium text-base-content/70">
                                <CalendarDays size={17} />
                                <span>Максимальная сумма (опционально)</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={0}
                                    step="any"
                                    className="input input-bordered flex-1"
                                    placeholder="—"
                                    disabled={isLoading}
                                    {...register('maxSalary', { valueAsNumber: true })}
                                />
                                <span className="text-base-content/40 text-lg font-medium w-10 text-center">
                  {selectedCurrency?.symbol}
                </span>
                            </div>

                            {errors.maxSalary && (
                                <p className="text-error text-xs mt-1">
                                    {errors.maxSalary.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || mutation.isPending || isLoading}
                        className="btn btn-primary w-full h-12 text-base shadow-md mt-3"
                    >
                        {mutation.isPending ? 'Сохраняется…' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    );
}
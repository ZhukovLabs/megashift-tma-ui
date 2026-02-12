'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateSalary, UpdateSalaryPayload, SalaryType } from '@/api-hooks/use-update-salary';
import { DollarSign, Clock, Calendar } from 'lucide-react';

type FormValues = UpdateSalaryPayload & {
    maxSalary?: number;
};

export default function SettingsPage() {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            typeSalary: 'MONTHLY',
            salary: 0,
            maxSalary: undefined,
        },
    });

    const mutation = useUpdateSalary();

    const onSubmit = (data: FormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
            <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-md p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-base-content">Настройки зарплаты</h1>
                <p className="text-center text-base-content/70 mb-6">
                    Обновите тип зарплаты, текущую сумму и максимальную для визуализации.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Тип зарплаты */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-base-content">Тип зарплаты</label>
                        <div className="relative">
                            <Controller
                                name="typeSalary"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="select select-bordered w-full appearance-none pl-10"
                                        aria-label="Тип зарплаты"
                                    >
                                        {Object.values(SalaryType).map((type) => (
                                            <option key={type} value={type}>
                                                {type === 'HOURLY'
                                                    ? 'Часовая'
                                                    : type === 'SHIFT'
                                                        ? 'Посменная'
                                                        : 'Месячная'}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                        </div>
                    </div>

                    {/* Сумма зарплаты */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-base-content">Сумма</label>
                        <div className="relative">
                            <Controller
                                name="salary"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        className="input input-bordered w-full pl-10"
                                        min={0}
                                        placeholder="Сумма зарплаты"
                                        aria-label="Сумма зарплаты"
                                    />
                                )}
                            />
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                        </div>
                    </div>

                    {/* Максимальная зарплата */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-base-content">Максимальная зарплата (опционально)</label>
                        <div className="relative">
                            <Controller
                                name="maxSalary"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        className="input input-bordered w-full pl-10"
                                        min={0}
                                        placeholder="Максимальная зарплата (для визуализации)"
                                        aria-label="Максимальная зарплата"
                                    />
                                )}
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                        </div>
                    </div>

                    {/* Кнопка — простой, спокойный стиль */}
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        aria-busy={mutation.isPending ? 'true' : 'false'}
                        className={
                            'mt-3 w-full bg-primary text-primary-content font-medium py-3 rounded-lg ' +
                            'shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30'
                        }
                    >
                        {mutation.isPending ? 'Сохраняем...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    );
}

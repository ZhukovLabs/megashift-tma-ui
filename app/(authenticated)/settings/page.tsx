'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateSalary, UpdateSalaryPayload, SalaryType } from '@/api-hooks/use-update-salary';

type FormValues = UpdateSalaryPayload;

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
        mutation.mutate(data, {
            onSuccess: () => {
            },
            onError: () => {
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Настройки</h1>
            <p className="text-base-content/70 mb-6 text-center">
                Здесь вы можете обновить ваш тип зарплаты, сумму и максимальную зарплату для визуализации.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full max-w-sm"
            >
                <Controller
                    name="typeSalary"
                    control={control}
                    render={({ field }) => (
                        <select {...field} className="select select-bordered w-full">
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

                <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="number"
                            className="input input-bordered w-full"
                            min={0}
                            placeholder="Сумма зарплаты"
                        />
                    )}
                />

                <Controller
                    name="maxSalary"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="number"
                            className="input input-bordered w-full"
                            min={0}
                            placeholder="Максимальная зарплата (для визуализации)"
                        />
                    )}
                />

                <button
                    type="submit"
                    className="btn btn-primary w-full mt-2"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Сохраняем...' : 'Сохранить'}
                </button>
            </form>
        </div>
    );
}

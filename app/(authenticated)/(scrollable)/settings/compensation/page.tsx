'use client';
import React, {useEffect} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {useUpdateSalary, useGetUserSettings, SalaryType} from '@/api-hooks/user/setting';
import {DollarSign, Calendar, Wallet} from 'lucide-react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const schema = z.object({
    typeSalary: z.enum(SalaryType, {error: 'Выберите тип оплаты'}),
    salary: z.number().min(0, {error: 'Зарплата не может быть меньше 0'}),
    maxSalary: z.number().min(1, {error: 'Максимальная сумма должна быть больше 0'}).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CompensationPage() {
    const {data: settings, isLoading} = useGetUserSettings();
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            typeSalary: 'MONTHLY' as SalaryType,
            salary: 0,
            maxSalary: undefined,
        },
    });

    const typeSalary = useWatch({control, name: 'typeSalary'});
    const mutation = useUpdateSalary();

    useEffect(() => {
        if (settings) {
            reset({
                typeSalary: settings.typeSalary,
                salary: settings.salary,
                maxSalary: settings.maxSalary ?? undefined,
            });
        }
    }, [settings, reset]);

    const onSubmit = (data: FormValues) => {
        mutation.mutate({
            typeSalary: data.typeSalary as SalaryType,
            salary: data.salary,
            maxSalary: data.maxSalary
        });
    };

    const salaryLabel =
        typeSalary === 'HOURLY'
            ? 'Ставка в час'
            : typeSalary === 'SHIFT'
                ? 'Ставка за смену'
                : 'Месячная зарплата';

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pb-10">
            <h1 className="text-2xl font-bold text-center">Оплата труда</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md space-y-6">
                <div className="rounded-2xl bg-base-100 p-5 shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet size={18} className="text-primary"/>
                        <span className="font-semibold">Тип оплаты</span>
                    </div>
                    <Controller
                        name="typeSalary"
                        control={control}
                        render={({field}) => (
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(SalaryType).map((type) => {
                                    const active = field.value === type;
                                    const label =
                                        type === 'HOURLY' ? 'Часовая' : type === 'SHIFT' ? 'Смена' : 'Месяц';
                                    return (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => field.onChange(type)}
                                            className={`rounded-xl py-2 text-sm font-medium transition
                                                ${active
                                                ? 'bg-primary text-primary-content shadow'
                                                : 'bg-base-200 text-base-content/70'}`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    />
                    {errors.typeSalary && (
                        <p className="text-xs text-red-500 mt-1">{errors.typeSalary.message}</p>
                    )}
                </div>

                <div className="rounded-2xl bg-base-100 p-5 shadow space-y-3">
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-primary"/>
                        <span className="font-semibold">{salaryLabel}</span>
                    </div>
                    <Controller
                        name="salary"
                        control={control}
                        render={({field}) => (
                            <input
                                {...field}
                                type="number"
                                min={0}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                                }}
                                className="input input-bordered w-full text-lg"
                                placeholder="Введите сумму"
                                disabled={isLoading}
                            />
                        )}
                    />

                    {errors.salary && (
                        <p className="text-xs text-red-500">{errors.salary.message}</p>
                    )}
                </div>

                <div className="rounded-2xl bg-base-100 p-5 shadow space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-base-content/60"/>
                        <span className="font-medium text-base-content/80">
                            Максимальная сумма (опционально)
                        </span>
                    </div>
                    <Controller
                        name="maxSalary"
                        control={control}
                        render={({field}) => (
                            <input
                                {...field}
                                type="number"
                                min={1}
                                value={field.value ?? ''}
                                onChange={(e) =>
                                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                                }
                                className="input input-bordered w-full"
                                placeholder="Для визуализации прогресса"
                                disabled={isLoading}
                            />
                        )}
                    />
                    {errors.maxSalary && (
                        <p className="text-xs text-red-500">{errors.maxSalary.message}</p>
                    )}
                    <p className="text-xs text-base-content/50">
                        Используется только для отображения прогресса дохода.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || isLoading}
                    className="btn btn-primary w-full h-12 text-base"
                >
                    {mutation.isPending ? 'Сохраняем...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
}

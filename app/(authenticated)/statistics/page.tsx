'use client';

import {useForm, Controller, useWatch} from 'react-hook-form';
import {ShiftStatisticsTable, ShiftHoursStatisticsTable} from "@/components/shift-statistics-table";
import {SalaryStatisticsTable} from "@/components/salary-statistics-table";

type FormValues = {
    year: number;
    month: number;
};

export default function StatisticsPage() {
    const {control} = useForm<FormValues>({
        defaultValues: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        },
    });

    const watchedYear = useWatch({control, name: 'year'});
    const watchedMonth = useWatch({control, name: 'month'});

    const selectedYear = Number(watchedYear);
    const selectedMonth = Number(watchedMonth);

    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-3">
                Статистика
            </h1>

            <form className="flex gap-4 mb-6 flex-wrap justify-center">
                <Controller
                    name="year"
                    control={control}
                    render={({field}) => (
                        <input
                            type="number"
                            {...field}
                            className="input input-bordered w-32"
                            min={2000}
                            max={2100}
                            placeholder="Год"
                        />
                    )}
                />

                <Controller
                    name="month"
                    control={control}
                    render={({field}) => (
                        <select {...field} className="select select-bordered w-32">
                            {Array.from({length: 12}, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('ru', {month: 'long'})}
                                </option>
                            ))}
                        </select>
                    )}
                />
            </form>

            <ShiftStatisticsTable year={selectedYear} month={selectedMonth}/>
            <ShiftHoursStatisticsTable year={selectedYear} month={selectedMonth}/>
            <SalaryStatisticsTable year={selectedYear} month={selectedMonth}/>
        </div>
    );
}

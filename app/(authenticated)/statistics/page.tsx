'use client';

import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ShiftStatisticsTable, ShiftHoursStatisticsTable} from "@/components/shift-statistics-table";

type FormValues = {
    year: number;
    month: number;
};

export default function StatisticsPage() {
    const {control, handleSubmit} = useForm<FormValues>({
        defaultValues: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        },
    });

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

    const onSubmit = (data: FormValues) => {
        setSelectedYear(data.year);
        setSelectedMonth(data.month);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Статистика смен</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-4 mb-6 flex-wrap justify-center"
            >
                {/* Год */}
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

                {/* Месяц */}
                <Controller
                    name="month"
                    control={control}
                    render={({field}) => (
                        <select
                            {...field}
                            className="select select-bordered w-32"
                        >
                            {Array.from({length: 12}, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('ru', {month: 'long'})}
                                </option>
                            ))}
                        </select>
                    )}
                />

                <button type="submit" className="btn btn-primary">
                    Показать
                </button>
            </form>

            <ShiftStatisticsTable year={selectedYear} month={selectedMonth}/>
            <ShiftHoursStatisticsTable year={selectedYear} month={selectedMonth}/>
        </div>
    );
}

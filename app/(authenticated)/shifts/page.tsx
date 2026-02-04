"use client";

import {Plus} from "lucide-react";
import {useGetShiftTemplates} from "./hooks/use-get-shift-templates";
import {format} from "date-fns";
import {useCreateShiftTemplate} from "@/app/(authenticated)/shifts/hooks/use-create-shift-template";

export default function ShiftsPage() {
    const {data: shifts, isLoading} = useGetShiftTemplates();
    const {mutateAsync} = useCreateShiftTemplate();

    const handleClick = async () => {
        await mutateAsync({
            label: "День",
            color: "#ff0",
            startTime: "12:00",
            endTime: "14:00",
        })
    }

    const renderShifts = () => {
        if (isLoading || !shifts) {
            return (
                <div className="flex flex-col items-center mt-12 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-primary/20 mb-4"/>
                    <p className="text-base-content/60 text-center text-lg">Загрузка смен...</p>
                </div>
            );
        }

        if (shifts.length === 0) {
            return (
                <div className="flex flex-col items-center mt-16 gap-6 text-center">
                    <p className="text-base-content/60 text-lg max-w-xs">
                        Сейчас смен нет — добавьте первую смену!
                    </p>

                    <button
                        onClick={handleClick}
                        className="flex items-center justify-center w-16 h-16 bg-primary text-primary-content rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300"
                        aria-label="Добавить смену"
                    >
                        <Plus strokeWidth={2.5} size={28}/>
                    </button>
                </div>
            );
        }

        return (
            <div className="w-full max-w-md flex flex-col gap-4 overflow-auto ">
                {shifts.map((shift) => {
                    const start = format(new Date(shift.startTime), "HH:mm");
                    const end = format(new Date(shift.endTime), "HH:mm");

                    return (
                        <div
                            key={shift.id}
                            className="p-4 bg-gradient-to-r from-primary/20 via-base-200 to-base-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                            onClick={handleClick}
                        >
                            <h2 className="font-semibold text-base-content mb-1 group-hover:text-primary transition-colors duration-200">
                                {shift.label}
                            </h2>
                            <p className="text-sm text-base-content/70">
                                {start} — {end}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-base-content">
                Смены
            </h1>
            {renderShifts()}
        </div>
    );
}

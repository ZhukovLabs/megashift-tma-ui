// app/shifts/page.tsx
"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Plus} from "lucide-react";
import {Popup, popup} from "@tma.js/sdk";

type Shift = {
    id: string;
    title: string;
    start: Date;
    end: Date;
};

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[] | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShifts([]);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-gradient-to-b from-base-100 via-base-200 to-base-100">
            {/* Заголовок */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-base-content">
                Смены
            </h1>

            {shifts === null ? (
                <div className="flex flex-col items-center mt-12">
                    <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse mb-4"></div>
                    <p className="text-base-content/60 text-center">Загрузка смен...</p>
                </div>
            ) : shifts.length > 0 ? (
                <div className="w-full max-w-md flex flex-col gap-4">
                    {shifts.map((shift) => (
                        <div
                            key={shift.id}
                            className="p-4 bg-gradient-to-r from-primary/20 via-base-200 to-base-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h2 className="font-semibold text-base-content mb-1">{shift.title}</h2>
                            <p className="text-sm text-base-content/70">
                                {shift.start.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})} —{" "}
                                {shift.end.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center mt-16 gap-6">
                    <p className="text-base-content/60 text-center text-lg max-w-xs">
                        Сейчас смен нет — добавьте первую смену!
                    </p>

                    <button
                        onClick={(e) => {
                            popup.show({
                                title: "Пока нельзя",
                                message: 'Но скоро можно будет'
                            })
                        }}
                        className="flex items-center justify-center w-16 h-16 bg-primary text-primary-content rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
                        aria-label="Добавить смену"
                    >
                        <Plus strokeWidth={2.5} size={28}/>
                    </button>
                </div>
            )}
        </div>
    );
}

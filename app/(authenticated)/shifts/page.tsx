"use client";

import React from "react";
import Link from "next/link";
import {Calendar} from "lucide-react";
import {ROUTES} from "@/constants/routes";

export default function ShiftsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-primary"/>
                <h1 className="text-3xl font-bold">Смены</h1>
            </div>

            <p className="text-base-content/70 mb-6 text-center max-w-md">
                Эта страница пока пустая. Здесь будет отображаться список возможных смен.
            </p>

            <div className="flex gap-4">
                <Link
                    href={ROUTES.schedule}
                    className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/80 transition-colors"
                >
                    К календарю
                </Link>

                <Link
                    href={ROUTES.shifts}
                    className="px-4 py-2 bg-base-300 text-base-content rounded-lg cursor-not-allowed opacity-50"
                >
                    Настройки (заглушка)
                </Link>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import {ROUTES} from "@/constants/routes";

export default function SettingsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Настройки</h1>
            <p className="text-base-content/70 mb-6 text-center">
                Эта страница пока пустая. Здесь будут ваши настройки календаря и аккаунта.
            </p>

            <div className="flex gap-4">
                <Link
                    href={ROUTES.schedule}
                    className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/80 transition-colors"
                >
                    К календарю
                </Link>

                <Link
                    href={ROUTES.settings}
                    className="px-4 py-2 bg-base-300 text-base-content rounded-lg cursor-not-allowed opacity-50"
                >
                    Настройки (заглушка)
                </Link>
            </div>
        </div>
    );
}

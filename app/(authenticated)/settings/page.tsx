"use client";

import Link from "next/link";
import {
    User,
    Shield,
    ChevronRight,
    Wallet
} from "lucide-react";
import {ROUTES} from "@/constants/routes";

const settingsSections = [
    {
        title: "Аккаунт",
        items: [
            {
                label: "Профиль",
                description: "Имя, фото, личные данные",
                href: ROUTES.settingsProfile,
                icon: User,
            },
            {
                label: "Безопасность",
                description: "Пароль, двухфакторная аутентификация",
                href: "/settings/security",
                icon: Shield,
            },
        ],
    },
    {
        title: "Работа",
        items: [
            {
                label: "Оплата труда",
                description: "Тип оплаты, ставка и лимиты",
                href: ROUTES.settingsCompensation,
                icon: Wallet,
            },
        ],
    }
];

export default function SettingsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pb-10">
            <h1 className="text-center text-2xl font-bold tracking-tight text-base-content">
                Настройки
            </h1>

            <div className="space-y-6 mt-6">
                {settingsSections.map((section) => (
                    <div key={section.title}>
                        <h2 className="mb-2 px-2 text-sm font-semibold uppercase text-base-content/60">
                            {section.title}
                        </h2>

                        <div className="rounded-2xl bg-base-100 shadow">
                            {section.items.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`
                                          flex items-center gap-4 px-4 py-4 active:bg-base-200
                                          ${index !== section.items.length - 1 ? "border-b border-base-200" : ""}
                                        `}
                                    >
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon size={20}/>
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <span className="text-base font-medium text-base-content">
                                                {item.label}
                                            </span>
                                            <span className="text-sm text-base-content/60">
                                                {item.description}
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="text-base-content/40"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import {
    User,
    CalendarCog,
    ChevronRight,
    Wallet,
    Users,
    AppWindow
} from "lucide-react";
import {ROUTES} from "@/shared/constants/routes";
import {motion} from "framer-motion";

const settingsSections = [
    {
        title: "Аккаунт",
        items: [
            {
                label: "Профиль",
                description: "Имя, фото, личные данные",
                icon: User,
                href: ROUTES.settingsProfile,
            },
            {
                label: "Общий доступ",
                description: "Доступ к вашему расписанию",
                icon: Users,
                href: ROUTES.settingsSharedAccess,
            },
            {
                label: "Выбор календаря",
                description: "Календарь для отображения",
                icon: CalendarCog,
                href: ROUTES.settingsCalendar,
            },
        ],
    },
    {
        title: "Приложение",
        items: [
            {
                label: "Настройки приложения",
                description: "Язык, уведомления",
                icon: AppWindow,
                href: ROUTES.settingsApp,
            },
        ],
    },
    {
        title: "Работа",
        items: [
            {
                label: "Оплата труда",
                description: "Тип оплаты, ставка и лимиты",
                icon: Wallet,
                href: ROUTES.settingsCompensation,
            }
        ],
    }
];

export function SettingsPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-3 pb-5 px-6 sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 mb-6">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <h1 className="text-3xl font-black tracking-tight text-base-content leading-none">
                        Настройки
                    </h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/20 mt-2 leading-none">
                        Конфигурация системы
                    </p>
                </div>
            </header>

            <main className="w-full px-4 max-w-xl mx-auto space-y-8 pb-32">
                {settingsSections.map((section) => (
                    <motion.div 
                        key={section.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="mb-3 px-2 text-[10px] font-black uppercase tracking-widest text-base-content/30">
                            {section.title}
                        </h2>

                        <div className="rounded-[32px] bg-base-100 border border-base-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            {section.items.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 active:bg-base-200/50 transition-colors group",
                                            index !== section.items.length - 1 ? "border-b border-base-200/50" : ""
                                        )}
                                    >
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-base-200/50 text-base-content/40 group-active:text-primary transition-colors">
                                            <Icon size={22} strokeWidth={2.5}/>
                                        </div>

                                        <div className="flex flex-1 flex-col min-w-0">
                                            <span className="text-base font-bold text-base-content/90 truncate">
                                                {item.label}
                                            </span>
                                            <span className="text-[11px] font-medium text-base-content/35 truncate uppercase tracking-tight">
                                                {item.description}
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="text-base-content/15 group-hover:text-primary transition-colors"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </main>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

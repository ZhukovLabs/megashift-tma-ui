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
import {useTranslations} from 'next-intl';
import {ROUTES} from "@/shared/constants/routes";

export function SettingsPage() {
    const t = useTranslations('settings');

    const settingsSections = [
        {
            title: t('sections.account'),
            items: [
                {
                    label: t('items.profile.label'),
                    description: t('items.profile.description'),
                    href: ROUTES.settingsProfile,
                    icon: User,
                },
                {
                    label: t('items.sharedAccess.label'),
                    description: t('items.sharedAccess.description'),
                    href: ROUTES.settingsSharedAccess,
                    icon: Users,
                },
                {
                    label: t('items.calendar.label'),
                    description: t('items.calendar.description'),
                    href: ROUTES.settingsCalendar,
                    icon: CalendarCog,
                },
            ],
        },
        {
            title: t('sections.app'),
            items: [
                {
                    label: t('items.appSettings.label'),
                    description: t('items.appSettings.description'),
                    href: ROUTES.settingsApp,
                    icon: AppWindow,
                },
            ],
        },
        {
            title: t('sections.work'),
            items: [
                {
                    label: t('items.compensation.label'),
                    description: t('items.compensation.description'),
                    href: ROUTES.settingsCompensation,
                    icon: Wallet,
                }
            ],
        }
    ];

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-2xl font-bold tracking-tight text-base-content">
                {t('title')}
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

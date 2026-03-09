'use client';

import {Globe} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import { setLocale } from '@/shared/i18n/actions';
import { localesMap } from '@/shared/i18n/config';

export function AppSettingsPage() {
    const t = useTranslations('settings.app');
    const currentLocale = useLocale();

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-center pt-6 pb-5">{t('title')}</h1>

            <div className="max-w-lg mx-auto px-4 space-y-4">
                <div className="card bg-base-100 shadow-sm rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Globe size={24}/>
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{t('language')}</div>
                            <select
                                value={currentLocale}
                                onChange={(e) => setLocale(e.target.value)}
                                className="select select-sm select-bordered w-full mt-1"
                            >
                                {localesMap.map((loc) => (
                                    <option key={loc.key} value={loc.key}>
                                        {loc.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

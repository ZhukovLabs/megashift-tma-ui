'use client';

import {useState} from 'react';
import {Globe, Bell, Check} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import { setLocale } from '@/shared/i18n/actions';
import { localesMap } from '@/shared/i18n/config';
import {useGetProfile, useUpdateProfile} from '@/features/user/api';
import {motion} from 'framer-motion';
import {toast} from 'react-toastify';
import cn from 'classnames';

const NOTIFY_OPTIONS = [
    { value: 0, labelKey: 'disabled' },
    { value: 1, labelKey: 'minutes1' },
    { value: 5, labelKey: 'minutes5' },
    { value: 15, labelKey: 'minutes15' },
    { value: 30, labelKey: 'minutes30' },
    { value: 60, labelKey: 'hour1' },
    { value: 120, labelKey: 'hours2' },
];

export function AppSettingsPage() {
    const t = useTranslations('settings.app');
    const tProfile = useTranslations('profile');
    const currentLocale = useLocale();
    
    const { data: user } = useGetProfile();
    const { mutateAsync: updateProfile } = useUpdateProfile();
    
    const [notifyValue, setNotifyValue] = useState(user?.notifyBeforeMinutes ?? 30);
    
    const notifyBefore = user?.notifyBeforeMinutes ?? 30;
    
    const handleNotifyChange = async (value: number) => {
        setNotifyValue(value);
        try {
            await updateProfile({ notifyBeforeMinutes: value });
            toast.success(tProfile('saved'));
        } catch {
            toast.error(tProfile('error'));
        }
    };

    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                        {t('title')}
                    </h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/25 mt-1.5 leading-none">
                        {t('subtitle')}
                    </p>
                </div>
            </header>

            <main className="w-full px-6 max-w-xl mx-auto pt-8 pb-32">
                <div className="space-y-6">
                    {/* Секция выбора языка */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">
                            {t('languageSection')}
                        </label>
                        
                        <div className="bg-base-100 rounded-[32px] border border-base-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                            {localesMap.map((loc, index) => {
                                const isActive = currentLocale === loc.key;
                                return (
                                    <button
                                        key={loc.key}
                                        onClick={() => setLocale(loc.key)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-6 py-5 transition-all active:bg-base-200/50",
                                            index !== localesMap.length - 1 && "border-b border-base-200/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                                isActive ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "bg-base-200 text-base-content/30"
                                            )}>
                                                <Globe size={20} strokeWidth={isActive ? 3 : 2} />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className={cn(
                                                    "text-base font-bold transition-colors",
                                                    isActive ? "text-base-content" : "text-base-content/60"
                                                )}>
                                                    {loc.title}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/20">
                                                    {loc.key}
                                                </span>
                                            </div>
                                        </div>

                                        {isActive && (
                                            <motion.div 
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                                            >
                                                <Check size={14} strokeWidth={4} />
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Секция уведомлений */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">
                            {t('notifications')}
                        </label>
                        
                        <div className="bg-base-100 rounded-[32px] border border-base-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="flex items-center gap-4 px-6 py-5">
                                <div className="w-10 h-10 rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20 flex items-center justify-center">
                                    <Bell size={20} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-base font-bold text-base-content">
                                        {t('notifyBefore')}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-base-200/50">
                                <select
                                    value={notifyBefore}
                                    onChange={(e) => handleNotifyChange(Number(e.target.value))}
                                    className="w-full h-14 px-6 bg-transparent font-bold text-base text-base-content outline-none appearance-none cursor-pointer text-left"
                                >
                                    {NOTIFY_OPTIONS.map((opt) => {
                                    const labelMap: Record<string, string> = {
                                        disabled: tProfile('disabled'),
                                        minutes1: tProfile('minutes1'),
                                        minutes5: tProfile('minutes5'),
                                        minutes15: tProfile('minutes15'),
                                        minutes30: tProfile('minutes30'),
                                        hour1: tProfile('hour1'),
                                        hours2: tProfile('hours2'),
                                    };
                                    return (
                                        <option key={opt.value} value={opt.value}>
                                            {labelMap[opt.labelKey]}
                                        </option>
                                    );
                                })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

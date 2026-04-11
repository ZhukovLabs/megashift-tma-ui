'use client';

import {Globe, ChevronDown, Check} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import { setLocale } from '@/shared/i18n/actions';
import { localesMap } from '@/shared/i18n/config';
import {motion} from 'framer-motion';
import cn from 'classnames';

export function AppSettingsPage() {
    const t = useTranslations('settings.app');
    const currentLocale = useLocale();

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

                    {/* Дополнительная карточка (плейсхолдер для уведомлений или темы) */}
                    <div className="opacity-40 grayscale pointer-events-none">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-1 block">
                                {t('notifications')}
                            </label>
                            <div className="bg-base-200/30 rounded-[32px] p-6 border border-dashed border-base-300 flex flex-col items-center justify-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center text-base-content/20">
                                    <Check size={24} />
                                </div>
                                <span className="text-xs font-bold text-base-content/20 uppercase tracking-widest">{t('inDevelopment')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

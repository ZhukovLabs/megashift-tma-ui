'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { setLocale } from '@/shared/i18n/actions';
import { localesMap } from '@/shared/i18n/config';
import type { StepProps } from '@/features/auth/model';

export const LanguageStep = ({ onNext }: StepProps) => {
    const t = useTranslations('start-form.language-step');
    const [selectedLocale, setSelectedLocale] = useState<string>('ru');
    const [isPending, setIsPending] = useState(false);

    const handleLocaleSelect = async (localeKey: string) => {
        setSelectedLocale(localeKey);
        setIsPending(true);
        await setLocale(localeKey);
        setIsPending(false);
    };

    const handleContinue = () => {
        onNext?.();
    };

    return (
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-6 shrink-0"
                >
                    <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full" />
                    <div className="w-24 h-24 rounded-[32px] border-2 border-base-100 shadow-xl relative overflow-hidden z-10 bg-base-200 flex items-center justify-center">
                        <Globe size={48} className="text-primary" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-black tracking-tight text-base-content leading-tight shrink-0"
                >
                    {t('title')}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-base font-bold text-base-content/60 leading-snug shrink-0"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 w-full max-w-xs space-y-3 shrink-0"
                >
                    {localesMap.map((locale) => (
                        <button
                            key={locale.key}
                            onClick={() => handleLocaleSelect(locale.key)}
                            disabled={isPending}
                            className={`
                                w-full p-4 rounded-2xl border-2 transition-all duration-200
                                flex items-center justify-between group
                                ${selectedLocale === locale.key
                                    ? 'border-primary bg-primary/5'
                                    : 'border-base-200 bg-base-100 hover:border-primary/30'
                                }
                            `}
                        >
                            <span className="text-base font-bold text-base-content">
                                {locale.title}
                            </span>
                            <div
                                className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                    ${selectedLocale === locale.key
                                        ? 'border-primary bg-primary'
                                        : 'border-base-300 bg-base-200'
                                    }
                                `}
                            >
                                {selectedLocale === locale.key && (
                                    <Check size={14} className="text-primary-content" />
                                )}
                            </div>
                        </button>
                    ))}
                </motion.div>
            </div>

            <div className="mt-4 shrink-0 pb-2">
                <button
                    className="btn btn-primary w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98]"
                    onClick={handleContinue}
                    disabled={isPending}
                >
                    {t('continue')}
                </button>
            </div>
        </div>
    );
};

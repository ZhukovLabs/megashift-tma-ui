import React, { useEffect, useState } from 'react';
import { StepProps, FormData, getCurrentTimeInTZ, getOffset, TIMEZONES } from '@/features/auth/model';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';

type EnterUserInfoStepProps = StepProps & { isValid: boolean };

export const EnterUserInfoStep = ({onNext, onBack, isValid}: EnterUserInfoStepProps) => {
    const {handleSubmit, formState: {errors}, register, control} = useFormContext<FormData>();
    const t = useTranslations('start-form.enter-user-info-step');

    const selectedTimezone = useWatch({control, name: 'timezone'});
    const [currentTime, setCurrentTime] = useState<string>(() => getCurrentTimeInTZ(selectedTimezone));

    useEffect(() => {
        if (!selectedTimezone) return;

        const timer = setInterval(() => {
            setCurrentTime(getCurrentTimeInTZ(selectedTimezone));
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedTimezone]);

    return (
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pr-1">
                <h2 className="text-xl font-black tracking-tight mb-5 text-base-content/90">{t("title")}</h2>

                <form onSubmit={handleSubmit(onNext!)} className="w-full space-y-4">
                    <div className="space-y-3">
                        <div className="group">
                            <input
                                {...register('surname')}
                                className="w-full h-12 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all font-bold text-sm outline-none placeholder:font-normal placeholder:opacity-30"
                                placeholder={t('surname.placeholder')}
                                autoComplete="family-name"
                                required
                            />
                            {errors.surname && <span className="text-error text-[10px] font-bold mt-1 ml-2">{errors.surname.message}</span>}
                        </div>

                        <div className="group">
                            <input
                                {...register('name')}
                                className="w-full h-12 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all font-bold text-sm outline-none placeholder:font-normal placeholder:opacity-30"
                                placeholder={t('name.placeholder')}
                                autoComplete="given-name"
                                required
                            />
                            {errors.name && <span className="text-error text-[10px] font-bold mt-1 ml-2">{errors.name.message}</span>}
                        </div>

                        <div className="group">
                            <input
                                {...register('patronymic')}
                                className="w-full h-12 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all font-bold text-sm outline-none placeholder:font-normal placeholder:opacity-30"
                                placeholder={t('patronymic.placeholder')}
                                autoComplete="additional-name"
                            />
                            {errors.patronymic && <span className="text-error text-[10px] font-bold mt-1 ml-2">{errors.patronymic.message}</span>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 mb-2 block">Часовой пояс</label>
                        <select
                            {...register('timezone', {required: true})}
                            className="w-full h-12 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm outline-none appearance-none"
                            defaultValue="UTC"
                        >
                            {TIMEZONES.map(({tz, label}) => (
                                <option key={tz} value={tz}>
                                    {label} ({getOffset(tz)})
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-base-content/40 mt-2 ml-2 font-medium">
                            У вас сейчас: <span className="text-primary font-bold">{currentTime}</span>
                        </p>
                    </div>
                </form>
            </div>

            <div className="mt-4 flex gap-3 pb-2 shrink-0">
                <button 
                    type="button" 
                    onClick={onBack} 
                    className="h-14 flex-1 rounded-2xl bg-base-200 text-base-content/60 font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                    Назад
                </button>
                <button
                    onClick={handleSubmit(onNext!)}
                    disabled={!isValid}
                    className="h-14 flex-1 rounded-2xl bg-primary text-primary-content font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
};

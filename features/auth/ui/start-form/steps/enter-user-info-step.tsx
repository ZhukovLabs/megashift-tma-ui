'use client';

import React, { useEffect, useState } from 'react';
import { StepProps, FormData, getCurrentTimeInTZ, getOffset, TIMEZONES } from '@/features/auth/model';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';

type EnterUserInfoStepProps = StepProps & { isValid: boolean };

export const EnterUserInfoStep = ({onNext, onBack, isValid}: EnterUserInfoStepProps) => {
    const {handleSubmit, formState: {errors}, register, control} = useFormContext<FormData>();
    const t = useTranslations();

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
        <div className="w-full mx-auto p-6 rounded-2xl">
            <h2 className="mb-6">{t('start-form.enter-user-info-step.title')}</h2>

            <form onSubmit={handleSubmit(onNext!)} className="w-full">
                <div className="flex flex-col [&>span]:mb-5">
                    <input
                        {...register('surname')}
                        className="input w-full"
                        placeholder={t('start-form.enter-user-info-step.surname.placeholder')}
                        autoComplete="family-name"
                        required
                    />
                    <span className="text-red-500 text-sm">{errors.surname?.message}</span>

                    <input
                        {...register('name')}
                        className="input w-full"
                        placeholder={t('start-form.enter-user-info-step.name.placeholder')}
                        autoComplete="given-name"
                        required
                    />
                    <span className="text-red-500 text-sm">{errors.name?.message}</span>

                    <input
                        {...register('patronymic')}
                        className="input w-full"
                        placeholder={t('start-form.enter-user-info-step.patronymic.placeholder')}
                        autoComplete="additional-name"
                    />
                    <span className="text-red-500 text-sm">{errors.patronymic?.message}</span>

                    <label className="mt-4 mb-1 font-medium">{t('start-form.enter-user-info-step.timezoneLabel')}</label>
                    <select
                        {...register('timezone', {required: true})}
                        className="input w-full"
                        defaultValue="UTC"
                    >
                        {TIMEZONES.map(({tz, label}) => (
                            <option key={tz} value={tz}>
                                {label} ({getOffset(tz)})
                            </option>
                        ))}
                    </select>
                    <span className="text-red-500 text-sm">{errors.timezone?.message}</span>

                    <p className="text-sm text-gray-500 mt-2">
                        {t('profile.timezone.currentTime', {time: currentTime})}
                    </p>
                </div>

                <div className="flex gap-3 mt-8">
                    <button type="button" onClick={onBack} className="btn btn-outline flex-1">
                        {t('common.back')}
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="btn btn-primary flex-1"
                    >
                        {t('common.continue')}
                    </button>
                </div>
            </form>
        </div>
    );
};

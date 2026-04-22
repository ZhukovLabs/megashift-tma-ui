'use client';

import React, { useEffect, useState } from 'react';
import { FormData, StepProps, getOffset, getCurrentTimeInTZ, TIMEZONES } from '@/features/auth/model';
import { useRegister } from '@/features/auth/api';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { useTranslations } from 'next-intl';

export const ConfirmationStep = ({
                                     onBack,
                                     values,
                                 }: StepProps & { values: FormData }) => {
    const {handleSubmit, formState: {isSubmitting}} = useFormContext<FormData>();
    const {mutateAsync: createUser} = useRegister();
    const router = useRouter();
    const t = useTranslations();

    const [currentTime, setCurrentTime] = useState<string>(getCurrentTimeInTZ(values.timezone));

    useEffect(() => {
        if (!values.timezone) return;
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTimeInTZ(values.timezone));
        }, 1000);
        return () => clearInterval(timer);
    }, [values.timezone]);

    const handleClick = handleSubmit(async (data) => {
        await createUser({
            ...data,
            patronymic: data.patronymic || undefined,
        });
        router.replace(ROUTES.root);
    });

    const tzInfo = TIMEZONES.find(t => t.tz === values.timezone);

    return (
        <div className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-tg-success-color rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">✓</span>
                </div>

                <h2 className="text-tg-text-color">{t('start-form.confirmation-step.title')}</h2>

                <div className="w-full bg-tg-bg-color rounded-xl p-4 space-y-3">
                    <DataRow label={t('start-form.confirmation-step.fields.surname')} value={values.surname}/>
                    <div className="divider"/>
                    <DataRow label={t('start-form.confirmation-step.fields.name')} value={values.name}/>
                    <div className="divider"/>
                    <DataRow label={t('start-form.confirmation-step.fields.patronymic')} value={values.patronymic}/>
                    <div className="divider"/>
                    <DataRow
                        label={t('start-form.confirmation-step.fields.timezone')}
                        value={tzInfo ? `${tzInfo.label} (${getOffset(tzInfo.tz)})` : values.timezone}
                    />
                </div>

                {values.timezone && (
                    <div className="text-tg-hint-color text-sm mt-2">
                        {t('start-form.confirmation-step.currentTime', {time: currentTime})}
                    </div>
                )}

                <div className="text-tg-hint-color text-sm mt-2">
                    {t('start-form.confirmation-step.description')}
                </div>

                <div className="flex gap-3 w-full mt-4">
                    <button onClick={onBack} className="btn btn-outline flex-1">{t('common.back')}</button>
                    <button
                        type="submit"
                        onClick={handleClick}
                        disabled={isSubmitting}
                        className="btn btn-primary flex-1"
                    >
                        {isSubmitting ? t('start-form.confirmation-step.submitting') : t('start-form.confirmation-step.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DataRow = ({label, value}: { label: string; value?: string }) => {
    const t = useTranslations();
    return (
        <div className="flex justify-between">
            <div className="text-tg-hint-color">{label}:</div>
            <div className="text-tg-text-color font-medium">{value || t('start-form.confirmation-step.fields.notSpecified')}</div>
        </div>
    );
};

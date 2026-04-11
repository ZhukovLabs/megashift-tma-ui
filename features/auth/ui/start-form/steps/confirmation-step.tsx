'use client';

import React, { useEffect, useState } from 'react';
import { FormData, StepProps, getOffset, getCurrentTimeInTZ, TIMEZONES } from '@/features/auth/model';
import { useRegister } from '@/features/auth/api';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { Check } from 'lucide-react';

export const ConfirmationStep = ({
                                     onBack,
                                     values,
                                 }: StepProps & { values: FormData }) => {
    const {handleSubmit, formState: {isSubmitting}} = useFormContext<FormData>();
    const {mutateAsync: createUser} = useRegister();
    const router = useRouter();

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
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-4 shrink-0">
                        <Check size={32} strokeWidth={3} />
                    </div>

                    <h2 className="text-xl font-black tracking-tight mb-4 text-base-content/90">Проверьте данные</h2>

                    <div className="w-full bg-base-200/40 rounded-[24px] p-4 space-y-2.5 border border-base-200/50">
                        <DataRow label="Фамилия" value={values.surname}/>
                        <DataRow label="Имя" value={values.name}/>
                        <DataRow label="Отчество" value={values.patronymic}/>
                        <div className="pt-1 mt-1 border-t border-base-200/50">
                            <DataRow
                                label="Пояс"
                                value={tzInfo ? `${tzInfo.label} (${getOffset(tzInfo.tz)})` : values.timezone}
                            />
                        </div>
                    </div>

                    <div className="mt-4 px-2 space-y-2">
                        <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest leading-relaxed">
                            Текущее время: <span className="text-primary">{currentTime}</span>
                        </p>
                        <p className="text-[10px] font-medium text-base-content/25 leading-relaxed">
                            Если всё верно, нажмите «Отправить», иначе вернитесь для редактирования.
                        </p>
                    </div>
                </div>
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
                    onClick={handleClick}
                    disabled={isSubmitting}
                    className="h-14 flex-1 rounded-2xl bg-primary text-primary-content font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
            </div>
        </div>
    );
};

const DataRow = ({label, value}: { label: string; value?: string }) => (
    <div className="flex justify-between items-center gap-4 py-0.5">
        <div className="text-[10px] font-black uppercase tracking-widest text-base-content/20">{label}</div>
        <div className="text-sm font-bold text-base-content/80 truncate">{value || '—'}</div>
    </div>
);

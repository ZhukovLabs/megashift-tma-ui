'use client';

import {useForm, useWatch} from 'react-hook-form';
import {ChangeEvent, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {ModalSheet} from '@/shared/ui/modal-sheet';
import { defaultValues } from '@/features/shift/model';
import {LoaderLarge} from '@/shared/ui/loader-large';
import {getContrastColor, lightenHex} from "@/shared/lib";
import {Clock, Type, Palette} from 'lucide-react';

export type ShiftFormValues = {
    label: string;
    color: string;
    startTime: string;
    endTime: string;
};

type Props = {
    isOpen: boolean;
    title: string;
    initialValues?: ShiftFormValues;
    isLoading?: boolean;
    isPending?: boolean;
    submitLabel: string;
    onClose: VoidFunction;
    onSubmit: (data: ShiftFormValues) => Promise<void> | void;
};

export function BaseShiftModal({
                                   isOpen,
                                   title,
                                   initialValues,
                                   isLoading = false,
                                   isPending = false,
                                   submitLabel,
                                   onClose,
                                   onSubmit,
                               }: Props) {
    const t = useTranslations('shifts');
    const {register, handleSubmit, reset, control, setValue} = useForm<ShiftFormValues>({
        defaultValues: initialValues ?? defaultValues,
    });

    const watchColor = useWatch({control, name: 'color'}) || defaultValues.color;

    useEffect(() => {
        if (initialValues) reset(initialValues);
        return () => reset(defaultValues);
    }, [initialValues, reset]);

    const onColorChange = (e: ChangeEvent<HTMLInputElement>) =>
        setValue('color', e.target.value.toLowerCase(), {shouldDirty: true, shouldValidate: true});

    const base = watchColor || '#ffffff';
    const light = lightenHex(base, 18);
    const textColor = getContrastColor(base);

    return (
        <ModalSheet
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl font-bold bg-base-200/50 hover:bg-base-200 transition-all active:scale-95"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending || isLoading}
                        className="flex-1 h-14 rounded-2xl font-bold bg-primary text-primary-content shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? t('saving') : submitLabel}
                    </button>
                </div>
            }
        >
            {isLoading ? (<LoaderLarge/>) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-4">
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[2px] text-base-content/30 ml-1">
                            <Type size={14} className="text-primary/50" />
                            {t('nameLabel')}
                        </label>
                        <input
                            {...register('label', {required: true})}
                            placeholder={t('namePlaceholder')}
                            disabled={isLoading}
                            className="w-full h-16 px-6 rounded-[24px] bg-base-200/30 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-lg font-bold outline-none placeholder:font-normal placeholder:opacity-30 shadow-inner"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[2px] text-base-content/30 ml-1">
                            <Palette size={14} className="text-primary/50" />
                            {t('visualStyle')}
                        </label>
                        <div
                            className="relative w-full h-20 rounded-[28px] border-2 border-transparent shadow-xl overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                            style={{
                                background: `linear-gradient(135deg, ${base} 0%, ${light} 100%)`,
                            }}
                            onClick={() => {
                                const el = document.getElementById('shift-color-input') as HTMLInputElement | null;
                                el?.click();
                            }}
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-between px-6"
                                style={{color: textColor}}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-white/30 shadow-2xl flex-shrink-0 relative overflow-hidden"
                                        style={{backgroundColor: base}}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xl font-black tracking-tight">{base.toUpperCase()}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{t('accentColor')}</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/10 group-hover:bg-black/20 transition-all">
                                    <Palette size={20} />
                                </div>
                            </div>

                            <input
                                id="shift-color-input"
                                type="color"
                                {...register('color', {required: true})}
                                onChange={onColorChange}
                                disabled={isLoading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[2px] text-base-content/30 ml-1">
                            <Clock size={14} className="text-primary/50" />
                            {t('timeInterval')}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <input
                                    type="time"
                                    {...register('startTime', {required: true})}
                                    disabled={isLoading}
                                    className="w-full h-16 px-6 rounded-[24px] bg-base-200/30 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-xl font-black outline-none shadow-inner flex justify-center text-center no-scrollbar"
                                />
                                <span className="absolute -top-2 left-6 px-2 bg-base-100 rounded-full text-[9px] font-black text-primary/40 group-focus-within:text-primary transition-colors">{t('start')}</span>
                            </div>
                            <div className="relative group">
                                <input
                                    type="time"
                                    {...register('endTime', {required: true})}
                                    disabled={isLoading}
                                    className="w-full h-16 px-6 rounded-[24px] bg-base-200/30 border-2 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all text-xl font-black outline-none shadow-inner text-center"
                                />
                                <span className="absolute -top-2 left-6 px-2 bg-base-100 rounded-full text-[9px] font-black text-primary/40 group-focus-within:text-primary transition-colors">{t('end')}</span>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </ModalSheet>
    );
}

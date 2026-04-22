'use client';

import {useForm, useWatch} from 'react-hook-form';
import {ChangeEvent, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {ModalSheet} from '@/shared/ui/modal-sheet';
import { defaultValues } from '@/features/shift/model';
import {LoaderLarge} from '@/shared/ui/loader-large';
import {getContrastColor, lightenHex} from "@/shared/lib";

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
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn btn-ghost rounded-full py-3 text-sm sm:text-base"
                    >
                        {t('common.cancel', {defaultValue: 'Отмена'})}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending || isLoading}
                        className="flex-1 btn btn-primary rounded-full py-3 text-sm sm:text-base"
                    >
                        {isPending ? t('edit.saving') : submitLabel}
                    </button>
                </div>
            }
        >
            {isLoading ? (<LoaderLarge/>) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        {...register('label', {required: true})}
                        placeholder={t('create.namePlaceholder')}
                        disabled={isLoading}
                        className="input input-bordered w-full py-3 text-base sm:text-base"
                    />

                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm text-gray-600">{t('create.colorLabel')}</label>
                        <div
                            className="relative w-full h-14 rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-transform duration-150"
                            style={{
                                background: `linear-gradient(90deg, ${base} 0%, ${light} 100%)`,
                            }}
                            title={base.toUpperCase()}
                            onClick={() => {
                                const el = document.getElementById('shift-color-input') as HTMLInputElement | null;
                                el?.focus();
                                el?.click();
                            }}
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-between px-4"
                                style={{color: textColor}}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-8 h-8 rounded-full border border-gray-300 shadow-inner flex-shrink-0"
                                        style={{backgroundColor: base}}
                                        aria-hidden
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium select-none">{base.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs opacity-80 select-none">{t('create.colorHint')}</span>
                                </div>
                            </div>

                            <input
                                id="shift-color-input"
                                type="color"
                                {...register('color', {required: true})}
                                onChange={onColorChange}
                                disabled={isLoading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label={t('create.colorLabel')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="time"
                            {...register('startTime', {required: true})}
                            disabled={isLoading}
                            className="input input-bordered w-full py-3 text-sm"
                        />
                        <input
                            type="time"
                            {...register('endTime', {required: true})}
                            disabled={isLoading}
                            className="input input-bordered w-full py-3 text-sm"
                        />
                    </div>
                </form>
            )}
        </ModalSheet>
    );
}

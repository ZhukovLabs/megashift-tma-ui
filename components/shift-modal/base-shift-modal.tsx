'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import ModalSheet from '@/components/modal-sheet';
import { defaultValues } from '@/components/shift-modal/config';

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
    onClose: () => void;
    onSubmit: (data: ShiftFormValues) => Promise<void> | void;
};

const clamp = (v: number, a = 0, b = 255) => Math.max(a, Math.min(b, Math.round(v)));

function hexToRgb(hex: string) {
    if (!hex) return { r: 255, g: 255, b: 255 };
    const h = hex.replace('#', '');
    if (h.length === 3) {
        return {
            r: parseInt(h[0] + h[0], 16),
            g: parseInt(h[1] + h[1], 16),
            b: parseInt(h[2] + h[2], 16),
        };
    }
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

function rgbToHex(r: number, g: number, b: number) {
    return (
        '#' +
        [r, g, b]
            .map((v) => {
                const s = clamp(v).toString(16);
                return s.length === 1 ? '0' + s : s;
            })
            .join('')
    );
}

function lightenHex(hex: string, percent: number) {
    const { r, g, b } = hexToRgb(hex);
    const nr = clamp(r + (255 - r) * (percent / 100));
    const ng = clamp(g + (255 - g) * (percent / 100));
    const nb = clamp(b + (255 - b) * (percent / 100));
    return rgbToHex(nr, ng, nb);
}

function getContrastColor(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#000000' : '#ffffff';
}

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
    const { register, handleSubmit, reset, control, setValue } = useForm<ShiftFormValues>({
        defaultValues: initialValues ?? defaultValues,
    });

    const watchColor = useWatch({ control, name: 'color' }) || defaultValues.color;

    useEffect(() => {
        if (initialValues) reset(initialValues);
        return () => reset(defaultValues);
    }, [initialValues, reset]);

    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue('color', e.target.value.toLowerCase(), { shouldDirty: true, shouldValidate: true });

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
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending || isLoading}
                        className="flex-1 btn btn-primary rounded-full py-3 text-sm sm:text-base"
                    >
                        {isPending ? 'Сохраняем...' : submitLabel}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input
                    {...register('label', { required: true })}
                    placeholder="Название смены"
                    disabled={isLoading}
                    className="input input-bordered w-full py-3 text-base sm:text-base"
                />

                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm text-gray-600">Цвет</label>
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
                            style={{ color: textColor }}
                        >
                            <div className="flex items-center gap-3">
                <span
                    className="w-8 h-8 rounded-full border border-gray-300 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: base }}
                    aria-hidden
                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium select-none">{base.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs opacity-80 select-none">Нажмите для выбора</span>
                            </div>
                        </div>

                        <input
                            id="shift-color-input"
                            type="color"
                            {...register('color', { required: true })}
                            onChange={onColorChange}
                            disabled={isLoading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Выбрать цвет смены"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="time"
                        {...register('startTime', { required: true })}
                        disabled={isLoading}
                        className="input input-bordered w-full py-3 text-sm"
                    />
                    <input
                        type="time"
                        {...register('endTime', { required: true })}
                        disabled={isLoading}
                        className="input input-bordered w-full py-3 text-sm"
                    />
                </div>
            </form>
        </ModalSheet>
    );
}
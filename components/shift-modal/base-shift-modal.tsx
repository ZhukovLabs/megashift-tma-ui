'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
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
    onClose: VoidFunction;
    onSubmit: (data: ShiftFormValues) => Promise<void> | void;
};

const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const sheetVariant = {
    hidden: { y: 48, opacity: 0, scale: 0.995 },
    visible: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 24, opacity: 0, scale: 0.995 },
};

/* ---- Utility helpers ---- */
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
    // Perceived luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#000000' : '#ffffff';
}

/* ---- Component ---- */
export const BaseShiftModal = ({
                                   isOpen,
                                   title,
                                   initialValues,
                                   isLoading = false,
                                   isPending = false,
                                   submitLabel,
                                   onClose,
                                   onSubmit,
                               }: Props) => {
    const { register, handleSubmit, reset, control, setValue } = useForm<ShiftFormValues>({
        defaultValues: initialValues ?? defaultValues,
    });

    // keep color reactive for the fancy preview
    const watchColor = useWatch({ control, name: 'color' }) || defaultValues.color;

    useEffect(() => {
        if (initialValues) reset(initialValues);
        return () => reset(defaultValues);
    }, [initialValues, reset]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // when user types a color manually in the native picker, react-hook-form will update via register
    // but ensure the value is normalized (lowercase hex)
    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue('color', e.target.value.toLowerCase(), { shouldDirty: true, shouldValidate: true });

    // compute gradient + text contrast
    const base = watchColor || '#ffffff';
    const light = lightenHex(base, 18);
    const textColor = getContrastColor(base);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariant}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative w-full sm:max-w-md max-h-[92vh] sm:max-h-[80vh] overflow-hidden"
                        variants={sheetVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                    >
                        <div className="flex flex-col h-full bg-base-100 rounded-t-2xl sm:rounded-2xl shadow-lg border border-base-300">
                            <div className="px-4 pt-3 pb-2 sm:pt-4 sm:pb-4">
                                <div className="mx-auto w-10 h-1.5 rounded-full bg-base-300 sm:hidden" />
                                <div className="flex items-center justify-between mt-3 sm:mt-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-primary truncate">{title}</h2>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label="Закрыть"
                                        className="p-2 rounded-md hover:bg-base-200 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col gap-4"
                            >
                                <input
                                    {...register('label', { required: true })}
                                    placeholder="Название смены"
                                    disabled={isLoading}
                                    className="input input-bordered w-full py-3 text-base sm:text-base"
                                />

                                {/* ---- Presentable color input ---- */}
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm text-gray-600">Цвет</label>

                                    <div
                                        className="relative w-full h-14 rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-transform duration-150"
                                        style={{
                                            background: `linear-gradient(90deg, ${base} 0%, ${light} 100%)`,
                                        }}
                                        title={base.toUpperCase()}
                                        onClick={() => {
                                            // clicking the visual panel should focus the native color input
                                            const el = document.getElementById('shift-color-input') as HTMLInputElement | null;
                                            el?.focus();
                                            el?.click();
                                        }}
                                    >
                                        {/* Color text and subtle overlay */}
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

                                        {/* The native color input sits above the visual but is invisible */}
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

                            <div className="px-4 pt-2 pb-4 sm:px-6 sm:pb-6 bg-base-100">
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
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

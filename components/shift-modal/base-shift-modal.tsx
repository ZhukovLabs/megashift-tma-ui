"use client";

import {X} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {defaultValues} from "@/components/shift-modal/config";

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
    const {register, handleSubmit, reset} = useForm<ShiftFormValues>({
        defaultValues: initialValues ?? defaultValues,
    });

    useEffect(() => {
        if (initialValues) reset(initialValues);
        return () => reset(defaultValues);
    }, [initialValues, reset]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className="relative w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-lg"
                        initial={{scale: 0.95}}
                        animate={{scale: 1}}
                        exit={{scale: 0.95}}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-base-content transition-colors hover:text-primary"
                        >
                            <X size={20}/>
                        </button>

                        <h2 className="mb-4 text-center text-xl font-semibold">{title}</h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <input
                                {...register("label", {required: true})}
                                placeholder="Название смены"
                                disabled={isLoading}
                                className="input input-bordered w-full"
                            />

                            <input
                                type="color"
                                {...register("color")}
                                disabled={isLoading}
                                className="h-10 w-full rounded border-none p-0"
                            />

                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    {...register("startTime", {required: true})}
                                    disabled={isLoading}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="time"
                                    {...register("endTime", {required: true})}
                                    disabled={isLoading}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || isLoading}
                                className="btn btn-primary mt-2"
                            >
                                {isPending ? "Сохраняем..." : submitLabel}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

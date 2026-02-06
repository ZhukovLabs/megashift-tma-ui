"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {useCreateShiftTemplate} from "@/app/(authenticated)/shifts/hooks/use-create-shift-template";

type FormValues = {
    label: string;
    color: string;
    startTime: string;
    endTime: string;
};

export default function ShiftModal() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const shiftId = searchParams.get("shiftId");
    const isOpen = Boolean(shiftId);

    const isCreating = shiftId === "new";

    const { mutateAsync, isPending } = useCreateShiftTemplate();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            label: "",
            color: "#3b82f6",
            startTime: "09:00",
            endTime: "18:00",
        },
    });

    const closeModal = () => {
        reset();
        const params = new URLSearchParams(searchParams);
        params.delete("shiftId");
        router.replace(`?${params.toString()}`);
    };

    const onSubmit = async (data: FormValues) => {
        if (!isCreating) return;

        await mutateAsync({
            label: data.label,
            color: data.color,
            startTime: data.startTime,
            endTime: data.endTime,
        });

        closeModal();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-lg"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-base-content transition-colors hover:text-primary"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="mb-4 text-center text-xl font-semibold">
                            Создать смену
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <input
                                {...register("label", { required: true })}
                                placeholder="Название смены"
                                className="input input-bordered w-full"
                            />

                            <input
                                type="color"
                                {...register("color")}
                                className="h-10 w-full rounded border-none p-0"
                            />

                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    {...register("startTime", { required: true })}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="time"
                                    {...register("endTime", { required: true })}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-primary mt-2"
                            >
                                {isPending ? "Сохраняем..." : "Создать"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

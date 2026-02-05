"use client";

import { FormEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (label: string, color: string, startTime: string, endTime: string) => void;
    isCreating?: boolean;
    label: string;
    setLabel: (val: string) => void;
    color: string;
    setColor: (val: string) => void;
    startTime: string;
    setStartTime: (val: string) => void;
    endTime: string;
    setEndTime: (val: string) => void;
}

export default function ShiftModal({
                                       isOpen, onClose, onSubmit, isCreating,
                                       label, setLabel, color, setColor, startTime, setStartTime, endTime, setEndTime
                                   }: ShiftModalProps) {

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(label, color, startTime, endTime);
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
                        className="bg-base-100 rounded-xl p-6 w-full max-w-sm shadow-lg relative"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-base-content hover:text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center">Создать смену</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Название смены"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="input input-bordered w-full"
                                required
                            />
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full h-10 p-0 border-none rounded"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="btn btn-primary mt-2"
                            >
                                {isCreating ? "Сохраняем..." : "Создать"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

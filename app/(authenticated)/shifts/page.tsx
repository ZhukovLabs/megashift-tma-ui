"use client";

import {FormEvent, useState} from "react";
import { Plus, X } from "lucide-react";
import { useGetShiftTemplates } from "./hooks/use-get-shift-templates";
import { useCreateShiftTemplate } from "@/app/(authenticated)/shifts/hooks/use-create-shift-template";
import { format } from "date-fns";

export default function ShiftsPage() {
    const { data: shifts, isLoading } = useGetShiftTemplates();
    const { mutateAsync, isPending: isCreating } = useCreateShiftTemplate();

    const [isOpen, setIsOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [color, setColor] = useState("#ff0");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await mutateAsync({ label, color, startTime, endTime });
        closeModal();
        setLabel("");
        setColor("#ff0");
        setStartTime("09:00");
        setEndTime("17:00");
    };

    const renderShifts = () => {
        if (isLoading || !shifts) {
            return (
                <div className="flex flex-col items-center mt-12 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-primary/20 mb-4" />
                    <p className="text-base-content/60 text-center text-lg">
                        Загрузка смен...
                    </p>
                </div>
            );
        }

        if (shifts.length === 0) {
            return (
                <div className="flex flex-col items-center mt-16 gap-6 text-center">
                    <p className="text-base-content/60 text-lg max-w-xs">
                        Сейчас смен нет — добавьте первую смену!
                    </p>

                    <button
                        onClick={openModal}
                        className="flex items-center justify-center w-16 h-16 bg-primary text-primary-content rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300"
                        aria-label="Добавить смену"
                    >
                        <Plus strokeWidth={2.5} size={28} />
                    </button>
                </div>
            );
        }

        return (
            <div className="w-full max-w-md flex flex-col gap-4 overflow-auto">
                {shifts.map((shift) => {
                    const start = shift.startTime.slice(11, 16);
                    const end = shift.endTime.slice(11, 16);

                    return (
                        <div
                            key={shift.id}
                            className="p-4 bg-gradient-to-r from-primary/20 via-base-200 to-base-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                            onClick={openModal} // Пока редирект на модалку
                        >
                            <h2 className="font-semibold text-base-content mb-1 group-hover:text-primary transition-colors duration-200">
                                {shift.label}
                            </h2>
                            <p className="text-sm text-base-content/70">
                                {start} - {end}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderModal = () => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-base-100 rounded-xl p-6 w-full max-w-sm shadow-lg relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-base-content hover:text-primary transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Создать смену
                    </h2>
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
                            title="Цвет смены"
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
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pt-8 pb-35">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-base-content">
                Смены
            </h1>
            {renderShifts()}
            {renderModal()}
            <button
                onClick={openModal}
                className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-content rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
                aria-label="Добавить смену"
            >
                <Plus strokeWidth={2.5} size={28} />
            </button>
        </div>
    );
}

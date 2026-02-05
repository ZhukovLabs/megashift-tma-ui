"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetShiftTemplates } from "./hooks/use-get-shift-templates";
import { useCreateShiftTemplate } from "@/app/(authenticated)/shifts/hooks/use-create-shift-template";
import { useRemoveShiftTemplate } from "./hooks/use-remove-shift-template";
import ShiftModal from "@/components/shift-modal";
import ShiftsList from "@/components/shifts-list";

export default function ShiftsPage() {
    const { data: shifts, isLoading } = useGetShiftTemplates();
    const { mutateAsync: createShift, isPending: isCreating } = useCreateShiftTemplate();
    const { mutateAsync: removeShift } = useRemoveShiftTemplate();

    const [isOpen, setIsOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [color, setColor] = useState("#ff0");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const handleSubmit = async (label: string, color: string, startTime: string, endTime: string) => {
        await createShift({ label, color, startTime, endTime });
        setIsOpen(false);
        setLabel(""); setColor("#ff0"); setStartTime("09:00"); setEndTime("17:00");
    };

    const handleDelete = async (shiftId: string, shiftLabel: string) => {
        const confirmed = confirm(`Удалить смену "${shiftLabel}"?`);
        if (!confirmed) return;
        try {
            await removeShift(shiftId);
        } catch (error) {
            console.error("Ошибка при удалении смены:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-base-content">
                Смены
            </h1>

            <ShiftsList
                shifts={shifts}
                isLoading={isLoading}
                onCreateClick={() => setIsOpen(true)}
                onOpenShift={() => setIsOpen(true)}
                onDeleteShift={(shift) => handleDelete(shift.id, shift.label)}
            />

            <ShiftModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
                isCreating={isCreating}
                label={label}
                setLabel={setLabel}
                color={color}
                setColor={setColor}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
            />

            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-content rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
            >
                <Plus strokeWidth={2.5} size={28} />
            </button>
        </div>
    );
}

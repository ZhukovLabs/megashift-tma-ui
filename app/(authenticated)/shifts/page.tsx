"use client";

import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import ShiftsList from "@/components/shifts-list";
import {CreateShiftModal, UpdateShiftModal} from "@/components/shift-modal";
import {useGetShiftTemplates} from "@/api-hooks/shift-templates/use-get-shift-templates";
import {useRemoveShiftTemplate} from "./hooks/use-remove-shift-template";
import {popup} from "@tma.js/sdk";

export default function ShiftsPage() {
    const router = useRouter();

    const {data: shifts, isLoading} = useGetShiftTemplates();
    const {mutateAsync: removeShift} = useRemoveShiftTemplate();

    const openCreateModal = () => router.push("?shiftId=new");
    const openEditModal = (id: string) => router.push(`?shiftId=${id}`);

    const handleDelete = async (id: string, label: string) => {
        const confirmed = await popup.show({
            title: 'Удалить?',
            message: `Удалить смену ${label}?`,
            buttons: [
                {id: 'yes', type: 'destructive', text: 'Да'},
                {id: 'no', type: 'cancel'},
            ],
        });
        if (confirmed !== 'yes') return;

        try {
            await removeShift(id);
        } catch {
            popup.show({
                title: "Ошибка",
                message: "Ошибка при удалении смены"
            });
        }
    };

    return (
        <div
            className="flex min-h-screen flex-col items-center bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4">
            <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                Смены
            </h1>

            <ShiftsList
                shifts={shifts ?? []}
                isLoading={isLoading}
                onCreateClick={openCreateModal}
                onOpenShift={(shift) => openEditModal(shift.id)}
                onDeleteShift={(shift) => handleDelete(shift.id, shift.label)}
            />

            <CreateShiftModal/>
            <UpdateShiftModal/>

            <button
                onClick={openCreateModal}
                className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
                aria-label="Добавить смену"
            >
                <Plus size={28} strokeWidth={2.5}/>
            </button>
        </div>
    );
}

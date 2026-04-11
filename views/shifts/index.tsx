"use client";

import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import ShiftsList from "@/features/shift/ui/shifts-list";
import {CreateShiftModal, UpdateShiftModal} from "@/features/shift/ui/shift-modal";
import {useGetShiftTemplates, useRemoveShiftTemplate} from "@/features/shift-template/api";
import {popup} from "@tma.js/sdk";
import {motion} from "framer-motion";

export function ShiftsPage() {
    const router = useRouter();

    const {data: shifts, isLoading} = useGetShiftTemplates();
    const {mutateAsync: removeShift} = useRemoveShiftTemplate();

    const openCreateModal = () => router.push("?shiftId=new");
    const openEditModal = (id: string) => router.push(`?shiftId=${id}`);

    const handleDelete = async (id: string, label: string) => {
        const confirmed = await popup.show({
            title: 'Удалить?',
            message: `Удалить шаблон "${label}"?\nЭто действие нельзя отменить`,
            buttons: [
                {id: 'onlyTemplate', type: 'destructive', text: 'Удалить только шаблон'},
                {id: 'templateWithShifts', type: 'destructive', text: 'Удалить шаблон и смены'},
                {id: 'no', type: 'cancel'},
            ],
        });
        if (!confirmed || confirmed === 'no') return;

        await removeShift({id, type: confirmed as 'onlyTemplate' | 'templateWithShifts'});
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="text-3xl font-black tracking-tight text-center mb-8 mt-2">
                Смены
            </h1>

            <div className="w-full">
                <ShiftsList
                    shifts={shifts ?? []}
                    isLoading={isLoading}
                    onCreateClick={openCreateModal}
                    onOpenShift={(shift) => openEditModal(shift.id)}
                    onDeleteShift={(shift) => handleDelete(shift.id, shift.label)}
                />
            </div>

            <CreateShiftModal/>
            <UpdateShiftModal/>

            <motion.button
                whileTap={{scale: 0.9}}
                onClick={openCreateModal}
                className="fixed bottom-7 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content shadow-[0_12px_32px_rgba(var(--p),0.3)] pb-safe transition-all"
                aria-label="Добавить смену"
            >
                <Plus size={28} strokeWidth={2.5}/>
            </motion.button>
        </div>
    );
}

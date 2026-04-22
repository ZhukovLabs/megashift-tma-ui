"use client";

import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTranslations} from 'next-intl';
import ShiftsList from "@/features/shift/ui/shifts-list";
import {CreateShiftModal, UpdateShiftModal} from "@/features/shift/ui/shift-modal";
import {useGetShiftTemplates, useRemoveShiftTemplate} from "@/features/shift-template/api";
import {popup} from "@tma.js/sdk";

export function ShiftsPage() {
    const router = useRouter();
    const t = useTranslations('shifts');

    const {data: shifts, isLoading} = useGetShiftTemplates();
    const {mutateAsync: removeShift} = useRemoveShiftTemplate();

    const openCreateModal = () => router.push("?shiftId=new");
    const openEditModal = (id: string) => router.push(`?shiftId=${id}`);

    const handleDelete = async (id: string, label: string) => {
        const confirmed = await popup.show({
            title: t('delete.popupTitle'),
            message: t('delete.popupMessage', {label}),
            buttons: [
                {id: 'onlyTemplate', type: 'destructive', text: t('delete.onlyTemplate')},
                {id: 'templateWithShifts', type: 'destructive', text: t('delete.withShifts')},
                {id: 'no', type: 'cancel'},
            ],
        });
        if (!confirmed || confirmed === 'no') return;

        await removeShift({id, type: confirmed as 'onlyTemplate' | 'templateWithShifts'});
    };

    return (
        <div
            className="flex min-h-screen flex-col items-center bg-gradient-to-b px-4">
            <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                {t('title')}
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
                aria-label={t('addButton')}
            >
                <Plus size={28} strokeWidth={2.5}/>
            </button>
        </div>
    );
}

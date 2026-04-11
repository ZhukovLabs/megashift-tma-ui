"use client";

import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import ShiftsList from "@/features/shift/ui/shifts-list";
import {CreateShiftModal, UpdateShiftModal} from "@/features/shift/ui/shift-modal";
import {useGetShiftTemplates, useRemoveShiftTemplate} from "@/features/shift-template/api";
import {popup} from "@tma.js/sdk";
import {motion, AnimatePresence} from "framer-motion";

export function ShiftsPage() {
    const router = useRouter();
    const t = useTranslations('shifts');

    const {data: shifts = [], isLoading} = useGetShiftTemplates();
    const {mutateAsync: removeShift} = useRemoveShiftTemplate();

    const openCreateModal = () => router.push("?shiftId=new");
    const openEditModal = (id: string) => router.push(`?shiftId=${id}`);

    const handleDelete = async (id: string, label: string) => {
        const confirmed = await popup.show({
            title: t('deleteConfirm'),
            message: t('deleteMessage', {label}),
            buttons: [
                {id: 'onlyTemplate', type: 'destructive', text: t('deleteOnlyTemplate')},
                {id: 'templateWithShifts', type: 'destructive', text: t('deleteTemplateWithShifts')},
                {id: 'no', type: 'cancel'},
            ],
        });
        if (!confirmed || confirmed === 'no') return;

        await removeShift({id, type: confirmed as 'onlyTemplate' | 'templateWithShifts'});
    };

    return (
        <div className="relative flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                            {t('title')}
                        </h1>
                        {!isLoading && shifts.length > 0 && (
                            <span className="bg-base-200 text-base-content/40 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                                {shifts.length}
                            </span>
                        )}
                    </motion.div>
                    {!isLoading && (
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/20 mt-1.5 leading-none">
                            {t('subtitle')}
                        </p>
                    )}
                </div>
            </header>

            <main className="w-full px-4 max-w-xl mx-auto pt-6 pb-32">
                <ShiftsList
                    shifts={shifts}
                    isLoading={isLoading}
                    onCreateClick={openCreateModal}
                    onOpenShift={(shift) => openEditModal(shift.id)}
                    onDeleteShift={(shift) => handleDelete(shift.id, shift.label)}
                />
            </main>

            <CreateShiftModal/>
            <UpdateShiftModal/>

            <AnimatePresence>
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openCreateModal}
                    className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg border-4 border-base-100 transition-transform"
                    style={{
                        left: 'calc(50% + 140px - 28px)',
                    }}
                >
                    <Plus size={28} strokeWidth={3}/>
                </motion.button>
            </AnimatePresence>
        </div>
    );
}

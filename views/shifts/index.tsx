"use client";

import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import ShiftsList from "@/features/shift/ui/shifts-list";
import {CreateShiftModal, UpdateShiftModal} from "@/features/shift/ui/shift-modal";
import {useGetShiftTemplates, useRemoveShiftTemplate} from "@/features/shift-template/api";
import {popup} from "@tma.js/sdk";
import {motion, AnimatePresence} from "framer-motion";

export function ShiftsPage() {
    const router = useRouter();

    const {data: shifts = [], isLoading} = useGetShiftTemplates();
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
        <div className="relative flex flex-col items-center w-full min-h-full overflow-hidden bg-base-100">
            <header className="w-full pt-3 pb-5 px-6 sticky top-0 z-30 bg-base-100/60 backdrop-blur-xl border-b border-base-200/20 mb-6">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <h1 className="text-3xl font-black tracking-tighter text-base-content leading-none">
                            Смены
                        </h1>
                        {!isLoading && shifts.length > 0 && (
                            <div className="bg-primary px-2.5 py-0.5 rounded-full shadow-sm">
                                <span className="text-[10px] font-black text-primary-content uppercase tracking-widest">
                                    {shifts.length}
                                </span>
                            </div>
                        )}
                    </motion.div>
                    {!isLoading && (
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/20 mt-2 leading-none">
                            Персональные шаблоны
                        </p>
                    )}
                </div>
            </header>

            <main className="w-full px-5 max-w-xl mx-auto relative z-10">
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
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openCreateModal}
                    className="fixed bottom-8 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content shadow-[0_20px_40px_rgba(var(--p),0.4)] transition-all ring-4 ring-base-100"
                    aria-label="Добавить смену"
                >
                    <Plus size={32} strokeWidth={3}/>
                </motion.button>
            </AnimatePresence>
        </div>
    );
}

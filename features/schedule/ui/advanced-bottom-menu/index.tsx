'use client';

import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';
import {useUserStore} from '@/entities/user';
import {useScheduleStore} from '@/features/schedule/model';
import {useGetShiftTemplates} from '@/features/shift-template/api';
import {formatInTimeZone} from 'date-fns-tz';
import {X, Edit2, Plus} from 'lucide-react';
import Link from 'next/link';
import {ROUTES} from '@/shared/constants/routes';

export function AdvancedBottomMenu() {
    const {data: templates = [], isLoading} = useGetShiftTemplates();
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');
    const selectedShiftId = useScheduleStore(s => s.selectedShiftId);
    const setSelectedShiftId = useScheduleStore(s => s.setSelectedShiftId);
    const editIsOpen = useScheduleStore(s => s.editIsOpen);
    const setEditIsOpen = useScheduleStore(s => s.setEditIsOpen);

    const toggleMenu = () => {
        const next = !editIsOpen;
        if (!next) setSelectedShiftId(null);
        setEditIsOpen(next);
    };

    const toggleShift = (id: string) => {
        setSelectedShiftId(selectedShiftId === id ? null : id);
    };

    return (
        <>
            <motion.button
                whileTap={{scale: 0.9}}
                onClick={toggleMenu}
                className={cn(
                    'fixed bottom-7 right-6 z-[70] h-14 w-14 rounded-full flex items-center justify-center',
                    'bg-primary text-primary-content shadow-[0_12px_32px_rgba(var(--p),0.3)] pb-safe transition-all'
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={editIsOpen ? 'close' : 'open'}
                        initial={{opacity: 0, rotate: -90, scale: 0.5}}
                        animate={{opacity: 1, rotate: 0, scale: 1}}
                        exit={{opacity: 0, rotate: 90, scale: 0.5}}
                        transition={{duration: 0.2}}
                    >
                        {editIsOpen ? <X size={26}/> : <Edit2 size={24}/>}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {editIsOpen && (
                    <motion.div
                        key="edit-bar-wrapper"
                        initial={{y: 100, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: 100, opacity: 0}}
                        transition={{type: 'spring', stiffness: 300, damping: 30}}
                        className="fixed bottom-6 left-6 z-[65] right-22 pb-safe flex justify-start"
                    >
                        <div
                            className={cn(
                                'flex items-center gap-3 px-4 py-2',
                                'h-16 w-full',
                                'rounded-[32px]',
                                'bg-base-100/95 backdrop-blur-2xl',
                                'shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-base-200/50'
                            )}
                        >
                            <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                                <Link
                                    href={ROUTES.createShift}
                                    className="flex flex-col items-center justify-center min-w-[70px] h-12 rounded-2xl bg-primary text-primary-content shrink-0 shadow-md transition-transform active:scale-95"
                                >
                                    <Plus size={20}/>
                                    <span className="text-[10px] font-black uppercase">Новая</span>
                                </Link>

                                {isLoading && <div className="loading loading-spinner loading-xs mx-auto text-primary"></div>}
                                
                                {templates.map(item => {
                                    const isActive = item.id === selectedShiftId;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleShift(item.id)}
                                            className={cn(
                                                'flex flex-col items-center justify-center min-w-[70px] h-12 rounded-2xl transition-all relative px-2 active:scale-95',
                                                isActive ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-base-200/50 hover:bg-base-200'
                                            )}
                                        >
                                            <div className="h-2.5 w-2.5 rounded-full mb-1 shrink-0" style={{backgroundColor: item.color}} />
                                            <span className="text-[10px] font-bold truncate w-full text-center leading-none">
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

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
import {useTranslations} from 'next-intl';

export function AdvancedBottomMenu() {
    const t = useTranslations();
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
                    'fixed bottom-6 z-[70] h-14 w-14 rounded-full flex items-center justify-center',
                    'bg-primary text-primary-content shadow-xl transition-all border-4 border-base-100'
                )}
                style={{
                    left: 'calc(50% + 140px - 28px)', // 50% + (половина ширины меню) - (половина ширины кнопки)
                }}
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
                        initial={{y: 100, x: '-50%'}}
                        animate={{y: 0, x: '-50%'}}
                        exit={{y: 100, x: '-50%'}}
                        transition={{type: 'spring', stiffness: 300, damping: 30}}
                        className="fixed bottom-6 left-1/2 z-[65] w-full max-w-[280px] pb-safe flex justify-center"
                    >
                        <div
                            className={cn(
                                'flex items-center gap-2 px-3 py-2',
                                'h-14 w-full pr-12', // Padding to not overlap content under the button
                                'rounded-[24px]',
                                'bg-base-100/95 backdrop-blur-2xl',
                                'shadow-xl border border-base-200/50'
                            )}
                        >
                            <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                                <Link
                                    href={ROUTES.createShift}
                                    className="flex flex-col items-center justify-center min-w-[70px] h-10 rounded-xl bg-primary text-primary-content shrink-0 shadow-md active:scale-95"
                                >
                                    <Plus size={18}/>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{t('schedule.createShiftButton')}</span>
                                </Link>

                                {isLoading && <div className="loading loading-spinner loading-xs mx-auto text-primary"></div>}
                                
                                {templates.map(item => {
                                    const isActive = item.id === selectedShiftId;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleShift(item.id)}
                                            className={cn(
                                                'flex flex-col items-center justify-center min-w-[70px] h-10 rounded-xl transition-all relative px-2 active:scale-95',
                                                isActive ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-base-200/50'
                                            )}
                                        >
                                            <div className="flex items-baseline gap-1.5 mb-0.5">
                                                <div className="h-2 w-2 rounded-full shrink-0" style={{backgroundColor: item.color}} />
                                                <span className="text-[9px] font-black text-base-content/40 leading-none">
                                                    {formatInTimeZone(item.startTime, tz, 'HH:mm')}
                                                </span>
                                            </div>
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

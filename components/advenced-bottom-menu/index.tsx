'use client';

import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';
import {useUserStore} from '@/store/user-store';
import {useScheduleStore} from '@/store/schedule-store';
import {useGetShiftTemplates} from '@/api-hooks/shift-templates/use-get-shift-templates';
import {formatInTimeZone} from 'date-fns-tz';
import {X, Edit2} from 'lucide-react';
import Link from 'next/link';
import {ROUTES} from '@/constants/routes';

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
                whileHover={{scale: 1.05}}
                onClick={toggleMenu}
                className={cn(
                    'fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full flex items-center justify-center',
                    'bg-base-100/90 backdrop-blur-xl shadow-lg shadow-black/10 border border-base-300/40',
                    'transition-all duration-300'
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={editIsOpen ? 'close' : 'open'}
                        initial={{opacity: 0, rotate: -90, scale: 0.8}}
                        animate={{opacity: 1, rotate: 0, scale: 1}}
                        exit={{opacity: 0, rotate: 90, scale: 0.8}}
                        transition={{duration: 0.2}}
                    >
                        {editIsOpen ? <X size={24}/> : <Edit2 size={24}/>}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {editIsOpen && (
                    <motion.div
                        initial={{y: 80, scale: 0.95}}
                        animate={{y: 0, scale: 1}}
                        exit={{y: 80, scale: 0.95}}
                        transition={{type: 'spring', stiffness: 260, damping: 24}}
                        className={cn(
                            'fixed bottom-4 left-2 sm:left-1/2 z-50 w-max max-w-[calc(100vw-90px)]',
                            // Translation for center on sm+
                            'sm:-translate-x-1/2'
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-full',
                                'bg-base-100/80 backdrop-blur-xl shadow-lg shadow-black/10 border border-base-300',
                                'overflow-x-auto',
                                'w-[calc(100vw-90px)] sm:mx-20 sm:w-auto'
                            )}
                        >
                            {isLoading && (
                                <span className="text-xs opacity-60 px-2">Загрузка...</span>
                            )}

                            {!isLoading && templates.length === 0 && (
                                <Link
                                    href={ROUTES.createShift}
                                    className={cn(
                                        'flex items-center justify-center px-4 py-2 mx-auto',
                                        'text-sm font-semibold rounded-lg',
                                        'bg-gradient-to-r from-primary to-secondary text-primary-content',
                                        'shadow-lg shadow-primary/40',
                                        'whitespace-nowrap'
                                    )}
                                >
                                    + Создать смену
                                </Link>
                            )}

                            {templates.map(item => {
                                const isActive = item.id === selectedShiftId;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleShift(item.id)}
                                        className={cn(
                                            'relative flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0 transition-all',
                                            'bg-base-200/80 border border-base-300/40',
                                            isActive
                                                ? 'text-primary shadow-md ring-1 ring-primary/40'
                                                : 'opacity-90 hover:opacity-100'
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="floating-menu-active"
                                                className="absolute inset-0 rounded-lg bg-primary/10"
                                                transition={{type: 'spring', stiffness: 400, damping: 30}}
                                            />
                                        )}

                                        <span
                                            className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
                                            style={{backgroundColor: item.color}}
                                        />

                                        <div className="flex flex-col leading-none z-10">
                                            <span className="text-xs font-semibold">{item.label}</span>
                                            <span className="text-[10px] opacity-70">
                                                {formatInTimeZone(item.startTime, tz, 'HH:mm')} –{' '}
                                                {formatInTimeZone(item.endTime, tz, 'HH:mm')}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

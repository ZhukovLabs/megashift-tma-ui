'use client';

import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';
import {useState} from 'react';
import {useUserStore} from "@/store/user-store";
import {formatInTimeZone} from "date-fns-tz";
import {useScheduleStore} from "@/store/schedule-store";
import {useGetShiftTemplates} from "@/api-hooks/use-get-shift-templates";
import {X, Edit2} from "lucide-react";


export function AdvancedBottomMenu() {
    const {data: shifts = [], isLoading} = useGetShiftTemplates();

    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');
    const [isOpen, setIsOpen] = useState(false);

    const {selectedShiftId, setSelectedShiftId} = useScheduleStore();

    const handleClick = (shiftId: string) => () => {
        if (selectedShiftId === shiftId) setSelectedShiftId(null);
        else setSelectedShiftId(shiftId);
    };

    return (
        <>
            <motion.button
                whileTap={{scale: 0.9}}
                whileHover={{scale: 1.05}}
                onClick={() => {
                    setIsOpen(visible => {
                        if (visible) setSelectedShiftId(null);
                        return !visible
                    })
                }}
                className={cn(
                    'fixed bottom-4 right-4 z-50',
                    'h-14 w-14 rounded-full flex items-center justify-center',
                    'bg-base-100/90 backdrop-blur-xl',
                    'shadow-lg shadow-black/10 border border-base-300/40',
                    'transition-all duration-300'
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isOpen ? 'close' : 'open'}
                        initial={{opacity: 0, rotate: -90, scale: 0.8}}
                        animate={{opacity: 1, rotate: 0, scale: 1}}
                        exit={{opacity: 0, rotate: 90, scale: 0.8}}
                        transition={{duration: 0.2}}
                    >
                        {isOpen ? <X size={24}/> : <Edit2 size={24}/>}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{y: 80, scale: 0.95}}
                        animate={{y: 0, scale: 1}}
                        exit={{y: 80, scale: 0.95}}
                        transition={{type: 'spring', stiffness: 260, damping: 24}}
                        className={cn(
                            'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
                            'max-w-lvw'
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center gap-2 px-3 py-2',
                                'rounded-full',
                                'bg-base-100/80 backdrop-blur-xl',
                                'shadow-lg shadow-black/10 border border-base-300',
                                'overflow-x-auto'
                            )}
                        >
                            {shifts.map(item => {
                                const isActive = item.id === selectedShiftId;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={handleClick(item.id)}
                                        className={cn(
                                            'relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all flex-shrink-0',
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
                                                {formatInTimeZone(item.startTime, tz, 'HH:mm')} – {formatInTimeZone(item.endTime, tz, 'HH:mm')}
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

'use client';
import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';
import {ReactNode, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useUserStore} from "@/store/user-store";
import {formatInTimeZone} from "date-fns-tz";

type MenuItem = {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    color: string;
    href?: string;
};

type BottomMenuProps = {
    items: MenuItem[];
    openIcon: ReactNode;
    closeIcon: ReactNode;
    className?: string;
};

export function AdvancedBottomMenu({
                                       items,
                                       openIcon,
                                       closeIcon,
                                       className,
                                   }: BottomMenuProps) {
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                whileTap={{scale: 0.9}}
                whileHover={{scale: 1.05}}
                onClick={() => setIsOpen(v => !v)}
                className={cn(
                    'fixed bottom-3 right-3 z-50',
                    'h-12 w-12 rounded-full',
                    'flex items-center justify-center',
                    'bg-base-100/90 backdrop-blur-xl',
                    'shadow-xl shadow-black/25',
                    'border border-base-300/40',
                    'transition-all duration-300',
                    className
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
                        {isOpen ? closeIcon : openIcon}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0, y: 12, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 12, scale: 0.95}}
                        transition={{type: 'spring', stiffness: 200, damping: 20}}
                        className={cn(
                            'fixed right-0 bottom-[72px] z-40 w-full',
                            'overflow-x-auto',
                        )}
                    >
                        <div className="flex gap-2 px-3 py-2 flex-nowrap">
                            {items.map((item, i) => {
                                const isActive = item.href && pathname === item.href;
                                return (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => item.href && router.push(item.href)}
                                        initial={{opacity: 0, x: 8}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: i * 0.05}}
                                        whileTap={{scale: 0.95}}
                                        whileHover={{scale: 1.05, boxShadow: '0 3px 10px rgba(0,0,0,0.15)'}}
                                        className={cn(
                                            'flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all',
                                            'bg-base-200/80 border border-base-300/40',
                                            isActive
                                                ? 'shadow-md ring-1 ring-primary/40'
                                                : 'opacity-90 hover:opacity-100'
                                        )}
                                    >
                                        <span
                                            className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
                                            style={{backgroundColor: item.color}}
                                        />
                                        <div className="flex flex-col leading-none">
                                            <span className="text-xs font-semibold">{item.label}</span>
                                            <span className="text-[10px] opacity-70">
                                                {formatInTimeZone(item.startTime, tz, 'HH:mm')} – {formatInTimeZone(item.endTime, tz, 'HH:mm')}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

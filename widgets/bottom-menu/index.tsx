'use client';

import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';
import {ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {useScheduleStore} from '@/features/schedule/model';

type MenuItem = {
    path: string;
    icon: ReactNode;
};

type BottomMenuProps = {
    items: MenuItem[];
    className?: string;
};

export function BottomMenu({items, className}: BottomMenuProps) {
    const pathname = usePathname();
    const editIsOpen = useScheduleStore((s) => s.editIsOpen);

    return (
        <AnimatePresence>
            {!editIsOpen && (
                <motion.div
                    key="bottom-menu-wrapper"
                    initial={{y: 100, opacity: 0, x: '-50%'}}
                    animate={{y: 0, opacity: 1, x: '-50%'}}
                    exit={{y: 100, opacity: 0, x: '-50%'}}
                    className="fixed bottom-6 left-1/2 z-40 w-full max-w-[360px] px-6 pb-safe flex justify-center"
                >
                    <div
                        className={cn(
                            'flex items-center justify-around gap-2 px-8',
                            'h-16 w-full',
                            'rounded-[32px]',
                            'bg-base-100/80 backdrop-blur-2xl',
                            'shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-base-200/50',
                            className
                        )}
                    >
                        {items.map(({path, icon}) => {
                            const isActive = pathname.startsWith(path);

                            return (
                                <Link
                                    key={path}
                                    href={path}
                                    className={cn(
                                        'relative flex items-center justify-center',
                                        'h-12 w-12',
                                        'rounded-2xl transition-all active:scale-90',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-base-content/40 hover:text-base-content/70'
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="bottom-menu-indicator"
                                            className="absolute inset-0 rounded-2xl bg-primary/10"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10">{icon}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

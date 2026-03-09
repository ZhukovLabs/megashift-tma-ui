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
                    key="bottom-menu"
                    initial={{y: 40, opacity: 0, scale: 0.95}}
                    animate={{y: 0, opacity: 1, scale: 1}}
                    exit={{y: 40, opacity: 0, scale: 0.95}}
                    transition={{type: 'spring', stiffness: 260, damping: 24}}
                    className={cn(
                        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
                        'pb-[env(safe-area-inset-bottom)]',
                        className
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center gap-1 px-2',
                            'h-14',
                            'rounded-full',
                            'bg-base-100/80 backdrop-blur-xl',
                            'shadow-lg shadow-black/10',
                            'border border-base-300'
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
                                        'h-10 w-10',
                                        'rounded-full transition-colors',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-base-content/60 hover:text-base-content'
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="floating-menu-active"
                                            className="absolute inset-0 rounded-full bg-primary/10"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                        />
                                    )}

                                    <motion.span
                                        animate={{scale: isActive ? 1.15 : 1}}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 20,
                                        }}
                                        className="relative z-10"
                                    >
                                        {icon}
                                    </motion.span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

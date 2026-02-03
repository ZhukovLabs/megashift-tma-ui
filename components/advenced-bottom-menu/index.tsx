'use client';

import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type MenuItem = {
    path: string;
    icon: ReactNode;
};

type BottomMenuProps = {
    items: MenuItem[];
    openIcon: ReactNode;
    closeIcon: ReactNode;
    className?: string;
};

export function AdvencedBottomMenu({
                                       items,
                                       openIcon,
                                       closeIcon,
                                       className,
                                   }: BottomMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (path: string) => () => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <>
            {/* КНОПКА — fixed, всегда на месте */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen((v) => !v)}
                className={cn(
                    'fixed bottom-4 right-4 z-50',
                    'h-14 w-14 rounded-full',
                    'flex items-center justify-center',
                    'bg-base-100/80 backdrop-blur-xl',
                    'shadow-lg shadow-black/10 border border-base-300',
                    className
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isOpen ? 'close' : 'open'}
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                    >
                        {isOpen ? closeIcon : openIcon}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            {/* МЕНЮ — тоже fixed, никак не влияет на кнопку */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={cn(
                            'fixed right-4 bottom-[88px] z-40', // 56px кнопка + отступ
                            'flex gap-2 px-2 py-3',
                            'rounded-full bg-base-100/80 backdrop-blur-xl',
                            'shadow-lg shadow-black/10 border border-base-300'
                        )}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    >
                        {items.map(({ path, icon }) => {
                            const isActive = path === pathname;

                            return (
                                <button
                                    key={path}
                                    onClick={handleClick(path)}
                                    className={cn(
                                        'relative flex items-center justify-center',
                                        'h-10 w-10 rounded-full flex-shrink-0',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-base-content/60 hover:text-base-content'
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="floating-menu-active"
                                            className="absolute inset-0 rounded-full bg-primary/10"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{icon}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

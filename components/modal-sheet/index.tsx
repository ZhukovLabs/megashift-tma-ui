// components/ui/ModalSheet.tsx
'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

type ModalSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
    className?: string;
    hideCloseButton?: boolean;
    noHeader?: boolean;
};

const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const sheetVariant = {
    hidden: { y: 48, opacity: 0, scale: 0.995 },
    visible: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 24, opacity: 0, scale: 0.995 },
};

export default function ModalSheet({
                                       isOpen,
                                       onClose,
                                       title,
                                       children,
                                       footer,
                                       maxWidth = 'sm:max-w-md',
                                       className = '',
                                       hideCloseButton = false,
                                       noHeader = false,
                                   }: ModalSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariant}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className={`relative w-full ${maxWidth} max-h-[80vh] sm:max-h-[80vh] ${className}`}
                        variants={sheetVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                    >
                        <div className="flex flex-col h-full max-h-[80vh] bg-base-100 rounded-t-2xl sm:rounded-2xl shadow-lg border border-base-300 overflow-hidden">
                            {!noHeader && (
                                <div className="px-5 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4 shrink-0">
                                    <div className="mx-auto w-10 h-1.5 rounded-full bg-base-300 sm:hidden mb-3" />
                                    <div className="flex items-center justify-between">
                                        {title && (
                                            <h2 className="text-lg sm:text-xl font-semibold text-primary truncate pr-4">
                                                {title}
                                            </h2>
                                        )}
                                        {!hideCloseButton && (
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                aria-label="Закрыть"
                                                className="p-2 -mr-2 rounded-full hover:bg-base-200 transition"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6 sm:pb-8 min-h-0">
                                {children}
                            </div>

                            {footer && (
                                <div className="px-5 py-4 sm:px-6 sm:py-5 bg-base-100 border-t border-base-200 shrink-0">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
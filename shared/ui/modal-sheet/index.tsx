'use client';

import {ReactNode} from 'react';
import {X} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';

type Props = {
    isOpen: boolean;
    onClose: VoidFunction;
    title: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
};

export function ModalSheet({isOpen, onClose, title, children, footer}: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[70]"
                    />
                    <motion.div
                        initial={{y: '100%'}}
                        animate={{y: 0}}
                        exit={{y: '100%'}}
                        transition={{type: 'spring', damping: 25, stiffness: 200}}
                        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-[80] outline-none"
                    >
                        <div className="bg-base-100 rounded-t-[32px] shadow-2xl flex flex-col max-h-[90dvh] pb-safe">
                            <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto mt-3 shrink-0" />
                            
                            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200/50">
                                <h2 className="text-xl font-bold truncate pr-4">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-base-200/50 text-base-content/50 active:scale-90 transition-all"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                            
                            <div className="flex-1 p-6 overflow-y-auto min-h-0">
                                {children}
                            </div>
                            
                            {footer && (
                                <div className="p-6 pt-2 border-t border-base-200/50">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

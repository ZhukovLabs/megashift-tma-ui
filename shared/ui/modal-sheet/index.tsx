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
                        className="fixed inset-0 bg-black/50 z-50"
                    />
                    <motion.div
                        initial={{y: '100%'}}
                        animate={{y: 0}}
                        exit={{y: '100%'}}
                        transition={{type: 'spring', damping: 25, stiffness: 300}}
                        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-50"
                    >
                        <div className="bg-base-100 rounded-t-3xl min-h-[200px] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-base-200">
                                <div className="w-8"/>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-200"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                            <div className="flex-1 p-4">
                                {children}
                            </div>
                            {footer && (
                                <div className="p-4 border-t border-base-200">
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

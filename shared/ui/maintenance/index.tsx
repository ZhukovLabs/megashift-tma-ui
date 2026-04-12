'use client';

import {Hammer, Construction} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';

export function MaintenanceView() {
    const t = useTranslations('common');

    return (
        <div className="fixed inset-0 z-[9999] bg-base-100 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-warning/20" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-warning/20" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="w-32 h-32 rounded-[40px] bg-warning/10 flex items-center justify-center text-warning mb-8 relative">
                    <Construction size={64} strokeWidth={1.5} />
                    <motion.div
                        animate={{ 
                            rotate: [0, -10, 10, -10, 0],
                            y: [0, -5, 0]
                        }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 3,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-base-100 shadow-xl border border-base-200 flex items-center justify-center text-warning"
                    >
                        <Hammer size={24} strokeWidth={2.5} />
                    </motion.div>
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black tracking-tight text-base-content mb-4"
            >
                Технические работы
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base font-medium text-base-content/40 max-w-xs leading-relaxed"
            >
                Мы проводим плановое обновление системы. Пожалуйста, вернитесь немного позже.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 px-6 py-3 rounded-2xl bg-base-200/50 border border-base-200 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20"
            >
                Megashift is updating
            </motion.div>
        </div>
    );
}

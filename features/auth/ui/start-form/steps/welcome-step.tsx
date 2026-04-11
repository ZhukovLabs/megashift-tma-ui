import type { StepProps } from '@/features/auth/model';
import { useTranslations } from 'next-intl';
import { useLaunchParams } from '@tma.js/sdk-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const WelcomeStep = ({onNext}: StepProps) => {
    const {
        tgWebAppData: {
            user: {firstName, photoUrl} = {}
        } = {}
    } = useLaunchParams(true);
    const t = useTranslations("start-form.welcome-step");

    return (
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 overflow-y-auto no-scrollbar">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-6 shrink-0"
                >
                    <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full" />
                    <div className="w-24 h-24 rounded-[32px] border-2 border-base-100 shadow-xl relative overflow-hidden z-10">
                        <img 
                            src={photoUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                            alt="user"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-lg z-20">
                        <Sparkles size={16} />
                    </div>
                </motion.div>

                <motion.h2 
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-black tracking-tight text-base-content leading-tight shrink-0"
                >
                    {t("title")},<br />
                    <span className="text-primary truncate max-w-xs inline-block">{firstName ?? t('user')}!</span>
                </motion.h2>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex flex-col gap-2 shrink-0"
                >
                    <p className="text-base font-bold text-base-content/60 leading-snug">
                        {t("subtitle")}
                    </p>
                    <p className="text-[13px] font-medium text-base-content/30 leading-relaxed max-w-[220px] mx-auto">
                        {t("description")}
                    </p>
                </motion.div>
            </div>

            <div className="mt-4 shrink-0 pb-2">
                <button 
                    className="btn btn-primary w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98]" 
                    onClick={onNext}
                >
                    {t("next")}
                </button>
            </div>
        </div>
    );
}

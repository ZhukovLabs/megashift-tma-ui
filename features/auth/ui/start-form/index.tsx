import { FormProvider } from 'react-hook-form';
import { useStartForm } from '@/features/auth/model';
import { ConfirmationStep, EnterUserInfoStep, LanguageStep, WelcomeStep } from './steps';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';

export const StartForm = () => {
    const {
        currentStep,
        totalSteps,
        methods,
        isValid,
        values,
        goToNext,
        goToBack,
    } = useStartForm();

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col bg-base-100 px-6 pt-8 pb-12 overflow-hidden relative min-h-[100dvh]">
                {/* Фоновые декорации */}
                <div className="absolute top-[-5%] right-[-5%] w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="mb-10 relative z-10 shrink-0">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div className="flex flex-col items-center w-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20 leading-none">Регистрация</span>
                            <h1 className="text-xl font-black tracking-tight text-base-content mt-1.5">Новый аккаунт</h1>
                        </div>
                        <div className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            {currentStep} / {totalSteps}
                        </div>
                    </div>

                    <div className="flex gap-2 h-1.5 w-full">
                        {Array.from({length: totalSteps}, (_, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isActive = stepNumber === currentStep;

                            return (
                                <div key={stepNumber} className="flex-1 h-full bg-base-200 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={false}
                                        animate={{ 
                                            width: isCompleted || isActive ? '100%' : '0%' 
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex flex-col flex-1 min-h-0"
                        >
                            {currentStep === 1 && <WelcomeStep onNext={goToNext}/>}
                            {currentStep === 2 && <LanguageStep onNext={goToNext}/>}
                            {currentStep === 3 && (
                                <EnterUserInfoStep onNext={goToNext} onBack={goToBack} isValid={isValid}/>
                            )}
                            {currentStep === 4 && (
                                <ConfirmationStep onBack={goToBack} values={values}/>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </FormProvider>
    );
};

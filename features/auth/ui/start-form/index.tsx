import { FormProvider } from 'react-hook-form';
import { useStartForm } from '@/features/auth/model';
import { ConfirmationStep, EnterUserInfoStep, WelcomeStep } from './steps';
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
            <div className="p-4 flex flex-col h-full justify-center">
                <div className="mb-8">
                    <div className="block w-full text-center text-tg-hint-color mt-2">
                        Шаг {currentStep} из {totalSteps}
                    </div>

                    <ul className="steps flex justify-center mx-auto">
                        {Array.from({length: totalSteps}, (_, index) => {
                            const stepNumber = index + 1;

                            return (
                                <li key={stepNumber} className={cn('step', {
                                    "step-info": stepNumber < currentStep || stepNumber === currentStep
                                })}/>
                            );
                        })}
                    </ul>
                </div>

                <div className="flex-1">
                    {currentStep === 1 && <WelcomeStep onNext={goToNext}/>}
                    {currentStep === 2 && (
                        <EnterUserInfoStep onNext={goToNext} onBack={goToBack} isValid={isValid}/>
                    )}
                    {currentStep === 3 && (
                        <ConfirmationStep onBack={goToBack} values={values}/>
                    )}
                </div>
            </div>
        </FormProvider>
    );
};

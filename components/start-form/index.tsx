import {FormProvider} from "react-hook-form";
import {useStartForm} from "./use-start-form";
import {ConfirmationStep, EnterUserInfoStep, WelcomeStep} from "./steps";
import {DevelopmentStep} from "@/components/start-form/steps/development-step";
import {useSyncRegisteredUser} from "@/components/start-form/hooks/use-sync-registered-user";
import cn from 'classnames'

export const StartForm = () => {
    const {
        currentStep,
        totalSteps,
        methods,
        isValid,
        values,
        goToNext,
        goToBack,
        setCurrentStep,
    } = useStartForm();

    const {isLoading} = useSyncRegisteredUser(methods, setCurrentStep);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="loading loading-spinner loading-xl"/>
            </div>
        );
    }

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
                        <ConfirmationStep onNext={goToNext} onBack={goToBack} values={values}/>
                    )}
                    {currentStep === 4 && <DevelopmentStep onNext={goToNext}/>}
                </div>
            </div>
        </FormProvider>
    );
};

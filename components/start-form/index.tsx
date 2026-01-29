import {FormProvider} from 'react-hook-form';
import {Steps, Text} from '@telegram-apps/telegram-ui';
import {useStartForm} from "./use-start-form";
import {ConfirmationStep, EnterUserInfoStep, WelcomeStep} from "./steps"
import {DevelopmentStep} from "@/components/start-form/steps/development-step";
import {useCheckRegistration} from "@/components/start-form/hooks/use-check-registration";
import {useEffect} from "react";

export const StartForm = () => {
    const {
        currentStep,
        totalSteps,
        methods,
        isValid,
        values,
        goToNext,
        goToBack,
        setCurrentStep
    } = useStartForm();

    const {data} = useCheckRegistration();

    useEffect(() => {
        if (data?.isRegistered) {
            methods.reset({
                name: data.user.name,
                surname: data.user.surname
            })
            setCurrentStep(4);
        }
    }, [data, methods, setCurrentStep]);

    return (
        <FormProvider {...methods}>
            <div className="p-4 flex flex-col h-full justify-center">
                <div className="mb-8">
                    <Text className="block w-full text-center text-tg-hint-color mt-2">
                        Шаг {currentStep} из {totalSteps}
                    </Text>
                    <Steps
                        count={totalSteps}
                        progress={currentStep}
                        className="max-w-md mx-auto"
                    />
                </div>

                <div className="flex-1">
                    {currentStep === 1 && <WelcomeStep onNext={goToNext}/>}
                    {currentStep === 2 && <EnterUserInfoStep onNext={goToNext} onBack={goToBack} isValid={isValid}/>}
                    {currentStep === 3 && (
                        <ConfirmationStep
                            onNext={goToNext}
                            onBack={goToBack}
                            values={values}
                        />
                    )}
                    {currentStep === 4 && (<DevelopmentStep/>)}
                </div>
            </div>
        </FormProvider>
    );
};
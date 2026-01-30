import {FormProvider} from "react-hook-form";
import {Steps, Text, Spinner} from "@telegram-apps/telegram-ui";
import {useStartForm} from "./use-start-form";
import {ConfirmationStep, EnterUserInfoStep, WelcomeStep} from "./steps";
import {DevelopmentStep} from "@/components/start-form/steps/development-step";
import {useSyncRegisteredUser} from "@/components/start-form/hooks/use-sync-registered-user";

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
                <Spinner size="l"/>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <div className="p-4 flex flex-col h-full justify-center">
                <div className="mb-8">
                    <Text className="block w-full text-center text-tg-hint-color mt-2">
                        Шаг {currentStep} из {totalSteps}
                    </Text>
                    <Steps count={totalSteps} progress={currentStep} className="max-w-md mx-auto"/>
                </div>

                <div className="flex-1">
                    {currentStep === 1 && <WelcomeStep onNext={goToNext}/>}
                    {currentStep === 2 && (
                        <EnterUserInfoStep onNext={goToNext} onBack={goToBack} isValid={isValid}/>
                    )}
                    {currentStep === 3 && (
                        <ConfirmationStep onNext={goToNext} onBack={goToBack} values={values}/>
                    )}
                    {currentStep === 4 && <DevelopmentStep/>}
                </div>
            </div>
        </FormProvider>
    );
};

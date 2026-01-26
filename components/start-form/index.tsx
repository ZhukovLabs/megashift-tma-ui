import React from 'react';
import {FormProvider} from 'react-hook-form';
import {Steps, Text} from '@telegram-apps/telegram-ui';
import {useStartForm} from "./use-start-form";
import {WelcomeStep, EnterUserInfoStep, ConfirmationStep} from "./steps"

export const StartForm = () => {
    const {
        currentStep,
        totalSteps,
        methods,
        isValid,
        isSubmitting,
        values,
        goToNext,
        goToBack,
    } = useStartForm();

    return (
        <FormProvider {...methods}>
            <div className="p-4 flex flex-col h-full justify-center bg-red-100">
                <div className="mb-8">
                    <Steps
                        count={totalSteps}
                        progress={currentStep}
                        className="max-w-md mx-auto"
                    />
                    <Text className="text-center text-tg-hint-color mt-2">
                        Шаг {currentStep} из {totalSteps}
                    </Text>
                </div>

                <div className="flex-1">
                    {currentStep === 1 && <WelcomeStep onNext={goToNext}/>}
                    {currentStep === 2 && <EnterUserInfoStep onNext={goToNext} onBack={goToBack} isValid={isValid}/>}
                    {currentStep === 3 && (
                        <ConfirmationStep
                            onNext={goToNext}
                            onBack={goToBack}
                            isSubmitting={isSubmitting}
                            values={values}
                        />
                    )}
                </div>
            </div>
        </FormProvider>
    );
};
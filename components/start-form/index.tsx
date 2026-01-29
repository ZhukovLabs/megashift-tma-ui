import React, {useEffect, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {Steps, Text} from '@telegram-apps/telegram-ui';
import {useStartForm} from "./use-start-form";
import {ConfirmationStep, EnterUserInfoStep, WelcomeStep} from "./steps"
import {retrieveRawInitData} from "@tma.js/bridge";
import {useRawInitData} from "@tma.js/sdk-react";
import {isValid as isValidToken} from "@tma.js/init-data-node/web";

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

    const hookRawInitData = useRawInitData();

    const [rawInitData] = useState(() => retrieveRawInitData());
    useEffect(() => {
        if (!rawInitData || !hookRawInitData) return;

        isValidToken(rawInitData, '8401593058:AAGcYEdR_v3R1qqsfsOfDp18qd0VWlzqJQM')
            .then((data) => {
                alert('isValid raw:' + data);
            })

        isValidToken(hookRawInitData, '8401593058:AAGcYEdR_v3R1qqsfsOfDp18qd0VWlzqJQM')
            .then((data) => {
                alert('isValid hook:' + data);
            })

    }, [hookRawInitData]);


    return (
        <FormProvider {...methods}>
            rawInitData: {rawInitData}
            hookRawInitData: {hookRawInitData}
            {rawInitData === hookRawInitData}

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
                </div>
            </div>
        </FormProvider>
    );
};
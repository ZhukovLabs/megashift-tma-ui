import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "./schema";
import {FormData} from './types';

export const useStartForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            patronymic: '',
            timezone: 'UTC'
        },
        mode: 'onTouched',
    });

    const {
        trigger,
        formState: {isValid, isSubmitting},
        control,
    } = methods;

    const values = useWatch({control});

    const goToNext = async () => {
        if (currentStep === 2) {
            const isStepValid = await trigger(['surname', 'name']);
            if (!isStepValid) return;
        }

        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const goToBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    return {
        currentStep,
        totalSteps,
        methods,
        isValid,
        isSubmitting,
        values,
        goToNext,
        goToBack
    };
};

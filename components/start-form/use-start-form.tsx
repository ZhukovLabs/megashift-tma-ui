import {useState} from "react";
import {useForm} from "react-hook-form";
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
        },
        mode: 'onTouched',
    });

    const {
        trigger,
        handleSubmit,
        formState: {isValid, isSubmitting},
        watch,
    } = methods;

    const values = watch();

    const goToNext = async () => {
        if (currentStep === totalSteps) {
            await handleSubmit(onSubmit)();
            return;
        }

        if (currentStep === 2) {
            const isStepValid = await trigger(['surname', 'name']);
            if (!isStepValid) return;
        }

        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const goToBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: FormData) => {
        console.log('Данные отправлены:', data);
        await new Promise(r => setTimeout(r, 1000));
    };

    return {
        currentStep,
        totalSteps,
        methods,
        isValid,
        isSubmitting,
        values,
        goToNext,
        goToBack,
    };
};

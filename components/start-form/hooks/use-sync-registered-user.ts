import {useEffect} from "react";
import {useCheckRegistration} from "./use-check-registration";
import {useUserStore} from "@/store/user-store";
import {UseFormReturn} from "react-hook-form";
import {FormData} from "@/components/start-form/types";

export const useSyncRegisteredUser = (
    methods: UseFormReturn<FormData>,
    setCurrentStep: (step: number) => void
) => {
    const {data, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        if (data?.isRegistered) {
            const user = {
                name: data.user.name,
                surname: data.user.surname,
                isRegistered: true,
            };

            setUser(user);

            methods.reset({
                name: user.name,
                surname: user.surname,
            });

            setCurrentStep(4);
        }
    }, [data, methods, setCurrentStep, setUser]);

    return {isLoading};
};

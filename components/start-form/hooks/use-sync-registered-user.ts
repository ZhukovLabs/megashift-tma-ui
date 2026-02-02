import {useEffect} from "react";
import {useCheckRegistration} from "./use-check-registration";
import {useUserStore} from "@/store/user-store";
import {UseFormReturn} from "react-hook-form";
import {FormData} from "@/components/start-form/types";
import {useRouter} from "next/navigation";

export const useSyncRegisteredUser = (
    methods: UseFormReturn<FormData>,
    setCurrentStep: (step: number) => void
) => {
    const {data, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    useEffect(() => {
        if (!data) return;

        const {isRegistered, user} = data;

        if (isRegistered && user) {
            const {name, surname} = user;
            const currentUser = {name, surname, isRegistered: true};
            setUser(currentUser);
            router.replace("/calendar");
        }
    }, [data, methods, router, setCurrentStep, setUser]);

    return {isLoading};
};

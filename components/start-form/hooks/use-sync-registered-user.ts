import {useEffect} from "react";
import {useCheckRegistration} from "./use-check-registration";
import {useUserStore} from "@/store/user-store";
import {UseFormReturn} from "react-hook-form";
import {FormData} from "@/components/start-form/types";
import {useRouter} from "next/navigation";
import {useLaunchParams} from "@tma.js/sdk-react";

export const useSyncRegisteredUser = (
    methods: UseFormReturn<FormData>,
    setCurrentStep: (step: number) => void
) => {
    const {tgWebAppData} = useLaunchParams(true);
    const {data, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    useEffect(() => {
        console.log(data);
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

            if (tgWebAppData?.user?.id === 1160368886) {
                router.replace("/calendar");
            } else {
                setCurrentStep(4);
            }
        }
    }, [data, methods, router, setCurrentStep, setUser, tgWebAppData?.user?.id]);

    return {isLoading};
};

import {useEffect} from "react";
import {useCheckRegistration} from "./use-check-registration";
import {useUserStore} from "@/store/user-store";
import {useRouter} from "next/navigation";

export const useSyncRegisteredUser = () => {
    const {data, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    useEffect(() => {
        if (!data) return;

        const {user} = data;

        if (user) {
            const {name, surname} = user;
            setUser({name, surname});
            router.replace("/calendar");
        }
    }, [data, router, setUser]);

    return {isLoading};
};

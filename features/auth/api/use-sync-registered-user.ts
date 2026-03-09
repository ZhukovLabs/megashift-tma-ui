import { useEffect } from 'react';
import { useCheckRegistration } from './use-check-registration';
import { useUserStore } from '@/entities/user';

export const useSyncRegisteredUser = () => {
    const { data: user, isFetching, isError } = useCheckRegistration();

    const setUser = useUserStore((s) => s.setUser);
    const setUnauthenticated = useUserStore((s) => s.setUnauthenticated);
    const isInitialized = useUserStore((s) => s.isInitialized);

    useEffect(() => {
        if (isFetching) return;

        if (isError || !user) {
            setUnauthenticated();
            return;
        }

        const { id, name, surname, patronymic, timezone } = user;
        setUser({ 
            id, 
            name, 
            surname, 
            patronymic, 
            timezone,
            currency: user.currency as "RUB" | "USD" | "BYN" | "EUR" | "KZT" | undefined
        });
    }, [user, isFetching, isError, setUser, setUnauthenticated]);

    return {
        user,
        isFetching,
        isInitialized,
        isError
    };
};

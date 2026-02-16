import { useEffect } from 'react';
import { useCheckRegistration } from './use-check-registration';
import { useUserStore } from '@/store/user-store';

export const useSyncRegisteredUser = () => {
    const { data: user, isLoading, isError } = useCheckRegistration();

    const setUser = useUserStore((s) => s.setUser);
    const setUnauthenticated = useUserStore((s) => s.setUnauthenticated);
    const isInitialized = useUserStore((s) => s.isInitialized);

    useEffect(() => {
        if (isLoading) return;

        if (isError || !user) {
            setUnauthenticated();
            return;
        }

        const { id, name, surname, patronymic, timezone } = user;
        setUser({ id, name, surname, patronymic, timezone });
    }, [user, isLoading, isError, setUser, setUnauthenticated]);

    return {
        user,
        isLoading,
        isInitialized,
    };
};

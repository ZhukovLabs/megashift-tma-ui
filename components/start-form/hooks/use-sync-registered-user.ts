import {useEffect} from 'react';
import {useCheckRegistration} from './use-check-registration';
import {useUserStore} from '@/store/user-store';

export const useSyncRegisteredUser = () => {
    const {data: user, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        if (!user) return;

        const {name, surname, patronymic, timezone} = user;
        setUser({name, surname, patronymic, timezone});
    }, [user, setUser]);

    return {
        user,
        isLoading,
    };
};

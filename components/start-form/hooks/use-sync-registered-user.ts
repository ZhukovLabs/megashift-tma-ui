import {useEffect} from 'react';
import {useCheckRegistration} from './use-check-registration';
import {useUserStore} from '@/store/user-store';

export const useSyncRegisteredUser = () => {
    const {data: user, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        if (!user) return;

        const {name, surname, patronymic, createdAt} = user;
        setUser({name, surname, patronymic, createdAt: new Date(createdAt)});
    }, [user, setUser]);

    return {
        user,
        isLoading,
    };
};

import {useEffect} from 'react';
import {useCheckRegistration} from './use-check-registration';
import {useUserStore} from '@/store/user-store';

export const useSyncRegisteredUser = () => {
    const {data, isLoading} = useCheckRegistration();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        if (!data?.user) return;

        const {name, surname, patronymic} = data.user;
        setUser({name, surname, patronymic, createdAt: new Date()});
    }, [data, setUser]);

    return {
        user: data?.user ?? null,
        isLoading,
    };
};

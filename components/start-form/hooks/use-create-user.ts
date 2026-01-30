import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {useUserStore} from "@/store/user-store";

interface CreateUserData {
    surname: string;
    name: string;
    patronymic?: string;
}

export const useCreateUser = () => {
    const setUser = useUserStore((s) => s.setUser);

    return useMutation<CreateUserData, Error, CreateUserData>({
        mutationFn: async (userData) => {
            const { data } = await api.post('/api/users', userData);
            return data;
        },
        onSuccess: async (data: CreateUserData) => {
            setUser({
                name: data.name,
                surname: data.surname,
                isRegistered: true,
            });
        }
    });
};

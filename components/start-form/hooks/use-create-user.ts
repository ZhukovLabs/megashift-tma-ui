import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface CreateUserData {
    surname: string;
    name: string;
    patronymic?: string;
}

export const useCreateUser = () => {
    return useMutation<unknown, Error, CreateUserData>({
        mutationFn: async (userData) => {
            const { data } = await api.post('/api/users', userData);
            return data;
        },
    });
};

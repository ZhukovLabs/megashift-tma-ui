import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useUserStore} from "@/entities/user";
import {ENDPOINTS} from "@/shared/config/api";

type CreateUserRequest = {
    surname: string;
    name: string;
    patronymic?: string;
    timezone: string;
}

type CreateUserResponse = CreateUserRequest & {
    id: string;
    createdAt: string;
}

export const useRegister = () => {
    const setUser = useUserStore((s) => s.setUser);

    return useMutation<CreateUserResponse, Error, CreateUserRequest>({
        mutationFn: async (userData) => {
            const {data} = await api.post(ENDPOINTS.register, userData);
            return data;
        },
        onSuccess: async (data) => {
            setUser({
                id: data.id,
                name: data.name,
                surname: data.surname,
                patronymic: data.patronymic,
                timezone: data.timezone
            });
        }
    });
};

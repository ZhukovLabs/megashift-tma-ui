import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ENDPOINTS} from "@/shared/config/api";

interface CheckRegistrationResponse {
    id: string;
    surname: string;
    name: string;
    patronymic?: string;
    createdAt: string;
    timezone: string;
}

export const useCheckRegistration = () => {
    return useQuery<CheckRegistrationResponse, void>({
        queryKey: ['check-registration'],
        queryFn: async () => {
            const {data} = await api.get<CheckRegistrationResponse>(ENDPOINTS.checkRegistration);
            return data;
        },
        retry: true
    });
};

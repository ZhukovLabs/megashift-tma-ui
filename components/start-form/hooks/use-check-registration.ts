import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface ResponseData {
    user: {
        surname: string;
        name: string;
        patronymic?: string;
    };
    isRegistered: boolean;
}

export const useCheckRegistration = (): UseQueryResult<ResponseData, unknown> => {
    return useQuery<ResponseData, unknown>({
        queryKey: ['check-registration'],
        queryFn: async () => {
            const { data } = await api.get<ResponseData>('/api/users/check-registration');
            return data;
        },
    });
};

import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

type CheckRegistrationResponse = {
    surname: string;
    name: string;
    patronymic?: string;
    createdAt: string;
}

export const useGetProfile = () => {
    return useQuery<CheckRegistrationResponse, void>({
        queryKey: ['check-registration'],
        queryFn: async () => {
            const {data} = await api.get<CheckRegistrationResponse>('/api/profile');
            return data;
        },
    });
};

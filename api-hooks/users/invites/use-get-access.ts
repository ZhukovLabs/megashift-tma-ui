import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export type AccessClaim = 'READ' | 'EDIT_OWNER' | 'EDIT_SELF' | 'DELETE_OWNER' | 'DELETE_SELF';

export type AccessUser = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    claims: AccessClaim[];
};

export const useGetAccess = () => {
    return useQuery<AccessUser[], Error>({
        queryKey: ['userAccess'],
        queryFn: async () => {
            const { data } = await api.get<AccessUser[]>('/api/users/access');
            return data;
        },
    });
};

import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';

export type AccessUser = {
    id: string;
    name: string;
    surname: string;
};

export type GetAccessResponse = {
    id: string;
    ownerId: string;
    grantedToId: string;
    claim: AccessUser;
    createdAt: string;
    updatedAt: string;
    grantedTo: AccessUser;
}[];

export const useGetAccess = () => {
    return useQuery<GetAccessResponse, Error>({
        queryKey: ['userAccess'],
        queryFn: async () => {
            const {data} = await api.get<GetAccessResponse>('/api/users/access');
            return data;
        },
    });
};

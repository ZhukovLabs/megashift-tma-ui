import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ENDPOINTS} from "@/shared/config/api";

export type ProfileResponse = {
    id: string;
    surname: string;
    name: string;
    patronymic?: string | null;
    createdAt: string;
};


export const useGetProfile = () => {
    return useQuery<ProfileResponse, void>({
        queryKey: ['profile'],
        queryFn: async () => {
            const {data} = await api.get<ProfileResponse>(ENDPOINTS.getProfile);
            return data;
        },
    });
};

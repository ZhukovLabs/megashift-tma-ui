import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {AccessClaim} from "@/constants/access-claim";
import {ENDPOINTS} from "@/shared/config/api";

export type AccessUser = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    claims: AccessClaim[];
};

export const useGetAvailableCalendars = () => {
    return useQuery<AccessUser[], Error>({
        queryKey: ['userAccess'],
        queryFn: async () => {
            const { data } = await api.get<AccessUser[]>(ENDPOINTS.getAvailableCalendars);
            return data;
        },
    });
};

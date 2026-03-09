import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { AccessClaim } from '@/entities/access';
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

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {AccessClaim} from "@/types";

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
            const { data } = await api.get<AccessUser[]>('/api/users/access/available-calendars');
            return data;
        },
    });
};

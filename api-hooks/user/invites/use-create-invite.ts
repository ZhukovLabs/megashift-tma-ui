import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {AccessClaim} from "@/constants/access-claim";

type CreateInviteResponse = {
    id: string;
};

type CreateInvitePayload = {
    claims: (keyof typeof AccessClaim)[]
};

export const useCreateInvite = () => {
    return useMutation<CreateInviteResponse, Error, CreateInvitePayload>({
        mutationFn: async (payload: CreateInvitePayload) => {
            const { data } = await api.post<CreateInviteResponse>('/api/users/invite', payload);
            return data;
        },
    });
};

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

type CreateInviteResponse = {
    id: string;
};

type CreateInvitePayload = {
    accessClaims: string[];
};

export const useCreateInvite = () => {
    return useMutation<CreateInviteResponse, Error, CreateInvitePayload>({
        mutationFn: async (payload: CreateInvitePayload) => {
            const { data } = await api.post<CreateInviteResponse>('/api/users/invite', payload);
            return data;
        },
    });
};

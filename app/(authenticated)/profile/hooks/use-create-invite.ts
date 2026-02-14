import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

type CreateInviteResponse = {
    id: string;
};

export const useCreateInvite = () => {
    return useMutation<CreateInviteResponse, Error>({
        mutationFn: async () => {
            const { data } = await api.post<CreateInviteResponse>('/api/users/invite');
            return data;
        },
    });
};

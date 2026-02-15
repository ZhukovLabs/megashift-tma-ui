import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

type ConsumeInviteResponse = {
    success: true;
    type: 'view',
    payload: {
        inviterId: string,
        access: 'view',
    },
}

export const useConsumeInvite = () => {
    return useMutation<ConsumeInviteResponse, Error, string>({
        mutationFn: async (inviteId: string) => {
            const { data } = await api.post<ConsumeInviteResponse>(`/users/invite/${inviteId}/consume`);
            return data;
        },
    });
};

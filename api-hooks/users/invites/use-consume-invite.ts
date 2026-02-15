import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {AccessClaim} from "@/types";

export type ConsumeInviteResponse = {
    success: true;
    type: 'invite';
    payload: {
        inviterId: string;
        claims: AccessClaim[];
    };
};

export const useConsumeInvite = () => {
    return useMutation<ConsumeInviteResponse, Error, string>({
        mutationFn: async (inviteId: string) => {
            const { data } = await api.post<ConsumeInviteResponse>(`/api/users/invite/${inviteId}/consume`);
            return data;
        },
    });
};

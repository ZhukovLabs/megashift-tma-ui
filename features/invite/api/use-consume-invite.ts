import {useMutation} from '@tanstack/react-query';
import {api} from '@/shared/config/axios';
import { AccessClaim } from '@/entities/access';
import {ENDPOINTS} from "@/shared/config/api";

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
            const {data} = await api.post<ConsumeInviteResponse>(ENDPOINTS.consumeInvite(inviteId));
            return data;
        },
    });
};

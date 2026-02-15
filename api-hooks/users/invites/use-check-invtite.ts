import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {AccessClaim} from "@/types";

export type CheckInviteResponse =
    | { exists: false }
    | {
    exists: true;
    type: 'invite';
    payload: {
        inviterId: string;
        claims: AccessClaim[];
    };
};

export const useCheckInvite = () => {
    return useMutation<any, Error, string>({
        mutationFn: async (inviteId: string) => {
            const {data} = await api.get<CheckInviteResponse>(`/users/invite/${inviteId}`);
            return data.exists ? {type: data.type, payload: data.payload} : null;
        },
    });
};

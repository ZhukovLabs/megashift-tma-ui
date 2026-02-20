import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import { AccessClaim } from '@/constants/access-claim';

export type CheckInviteResponse = {
    exists: true;
    inviter: {
        surname: string,
        name: string,
        patronymic?: string,
    },
    claims: AccessClaim[],
};

export const useCheckInvite = () => {
    return useMutation<CheckInviteResponse, Error, string>({
        mutationFn: async (inviteId: string) => {
            const {data} = await api.get<CheckInviteResponse>(`/api/users/invite/${inviteId}`);

            return data;
        }
    });
};

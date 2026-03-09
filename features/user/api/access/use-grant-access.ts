import { useMutation } from "@tanstack/react-query";
import { api } from '@/shared/config/axios';
import { AccessClaim } from '@/entities/access';
import {ENDPOINTS} from "@/shared/config/api";

export type GrantAccessRequest = {
    targetUserId: string;
    claims: AccessClaim[];
};

export type GrantAccessResponse = {
    ownerId: string;
    grantedToId: string;
    claim: AccessClaim;
    createdAt: string;
    updatedAt: string;
}[];

export const useGrantAccess = () => {
    return useMutation<GrantAccessResponse, Error, GrantAccessRequest>({
        mutationFn: async (body: GrantAccessRequest) => {
            const { data } = await api.post<GrantAccessResponse>(ENDPOINTS.grantClaim, body);
            return data;
        },
    });
};

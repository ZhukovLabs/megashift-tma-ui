import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { AccessClaim } from '@/entities/access';
import {ENDPOINTS} from "@/shared/config/api";

type CreateInviteResponse = {
    id: string;
};

type CreateInvitePayload = {
    claims: (keyof typeof AccessClaim)[]
};

export const useCreateInvite = () => {
    return useMutation<CreateInviteResponse, Error, CreateInvitePayload>({
        mutationFn: async (payload: CreateInvitePayload) => {
            const { data } = await api.post<CreateInviteResponse>(ENDPOINTS.createInvite, payload);
            return data;
        },
    });
};

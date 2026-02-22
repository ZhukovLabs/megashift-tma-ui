import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {ProfileResponse} from './use-get-profile';
import {ENDPOINTS} from "@/shared/config/api";

export type UpdateProfilePayload = {
    surname?: string;
    name?: string;
    patronymic?: string;
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            const {data} = await api.patch<ProfileResponse>(ENDPOINTS.updateProfile, payload);
            return data;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(['profile'], data);
        },
    });
};
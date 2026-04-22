import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '@/shared/config/axios';
import {ProfileResponse} from './use-get-profile';
import {ENDPOINTS} from "@/shared/config/api";

export type UpdateProfilePayload = {
    surname?: string;
    name?: string;
    patronymic?: string;
    timezone?: string;
    notifyBeforeMinutes?: number;
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            const {data} = await api.patch<ProfileResponse>(ENDPOINTS.updateProfile, payload);
            return data;
        },

        onSuccess: (data, variables) => {
            queryClient.setQueryData(['profile'], data);

            // Invalidate shifts and shift templates when timezone changes
            // as they depend on timezone for proper display
            if (variables.timezone !== undefined) {
                queryClient.invalidateQueries({ queryKey: ['month-shifts'] });
                queryClient.invalidateQueries({ queryKey: ['shift-templates'] });
            }
        },
    });
};

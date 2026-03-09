import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from '@/shared/config/axios';
import {ENDPOINTS} from "@/shared/config/api";

export const useRevokeAllAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (targetUserId: string) => {
            const {data} = await api.delete(ENDPOINTS.revokeAllRights(targetUserId));

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users-access"]});
        },
    });
};

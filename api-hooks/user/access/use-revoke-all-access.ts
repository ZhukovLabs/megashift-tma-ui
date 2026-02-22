import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios";

export const useRevokeAllAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (targetUserId: string) => {
            const {data} = await api.delete(
                `/api/users/access/${targetUserId}`
            );

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users-access"]});
        },
    });
};
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {GrantOrUpdateAccessDto} from "./types";

export const useRevokeAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: GrantOrUpdateAccessDto) => {
            const {data} = await api.delete("/api/users/access", {
                data: dto,
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users-access"]});
        },
    });
};
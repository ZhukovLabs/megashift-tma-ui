import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {GrantOrUpdateAccessDto} from "./types";
import {ENDPOINTS} from "@/shared/config/api";

export const useUpdateAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: GrantOrUpdateAccessDto) => {
            const {data} = await api.post(ENDPOINTS.updateUserClaims, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users-access"]});
        },
    });
};
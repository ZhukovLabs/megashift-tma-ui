import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ENDPOINTS } from "@/shared/config/api";

export const useUnsubscribeFromCalendar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ownerUserId: string) => {
            const { data } = await api.delete(ENDPOINTS.unsubscribeFromCalendar(ownerUserId));

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-access"] });
            queryClient.invalidateQueries({ queryKey: ["available-calendars"] });
        },
    });
};
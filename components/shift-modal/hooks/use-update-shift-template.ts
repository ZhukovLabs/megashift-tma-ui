import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type UpdateShiftTemplateRequest = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

type ShiftTemplateResponse = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

export const useUpdateShiftTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ShiftTemplateResponse,
        Error,
        UpdateShiftTemplateRequest
    >({
        mutationFn: async ({ id, ...data }) => {
            const response = await api.patch<ShiftTemplateResponse>(
                `/api/shift-templates/${id}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
        },
    });
};

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type ShiftTemplateResponse = {
    id: string;
    label: string;
    color?: string;
    startTime: string;
    endTime: string;
};

export const useGetShiftTemplate = (id: string) => {
    return useQuery({
        queryKey: ["shift-template", id],
        queryFn: async () => {
            const response = await api.get<ShiftTemplateResponse>(
                `/api/shift-templates/${id}`
            );
            return response.data;
        },
        enabled: Boolean(id),
    });
};

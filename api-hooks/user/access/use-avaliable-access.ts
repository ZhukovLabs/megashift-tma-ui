import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {AccessUser} from "./types";

export const useAvailableAccess = () => {
    return useQuery<AccessUser[], Error>({
        queryKey: ["users-access"],
        queryFn: async () => {
            const {data} = await api.get<AccessUser[]>("/api/users/access/granted-users");
            return data;
        },
    });
};
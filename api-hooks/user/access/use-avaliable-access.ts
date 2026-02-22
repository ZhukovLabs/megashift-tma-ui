import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios";
import {AccessUser} from "./types";
import {ENDPOINTS} from "@/shared/config/api";

export const useAvailableAccess = () => {
    return useQuery<AccessUser[], Error>({
        queryKey: ["users-access"],
        queryFn: async () => {
            const {data} = await api.get<AccessUser[]>(ENDPOINTS.getGrantedUsers);
            return data;
        },
    });
};
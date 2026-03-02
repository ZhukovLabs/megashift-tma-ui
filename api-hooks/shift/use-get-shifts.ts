import {useQuery, keepPreviousData} from '@tanstack/react-query';
import {api} from '@/lib/axios';
import {useOwnerId} from '@/hooks/use-owner-id';
import axios from "axios";
import {useUserStore} from "@/entities/user";
import {ENDPOINTS} from "@/shared/config/api";

export type ShiftDto = {
    id: string;
    date: string;
    actualStartTime: string | null;
    actualEndTime: string | null;
    shiftTemplateId: string | null;
};

type GetShiftsParams = {
    year: number;
    month: number;
};

type GetShiftsResponse = ShiftDto[];

const monthShiftsKey = (year: number, month: number) =>
    ['month-shifts', year, month] as const;

export const useGetShifts = ({year, month}: GetShiftsParams) => {
    const ownerId = useOwnerId();
    const setOwnerId = useUserStore(s => s.setOwnerId);

    return useQuery<GetShiftsResponse>({
        queryKey: monthShiftsKey(year, month),
        queryFn: async ({signal}) => {
            try {
                const {data} = await api.get<GetShiftsResponse>(ENDPOINTS.getShiftsByMonth, {
                    params: {year, month, ownerId},
                    signal,
                });
                return data;
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    setOwnerId(null);
                }
                throw error;
            }
        },
        enabled: Number.isFinite(year) && Number.isFinite(month),
        placeholderData: keepPreviousData,
    });
};
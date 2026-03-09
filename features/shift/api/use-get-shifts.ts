import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/shared/config/axios';
import { useOwnerId, useUserStore } from '@/entities/user';
import axios from 'axios';
import { ENDPOINTS } from '@/shared/config/api';
import type { ShiftDto } from '@/features/shift/model';

type GetShiftsParams = {
    year: number;
    month: number;
};

type GetShiftsResponse = ShiftDto[];

const monthShiftsKey = (year: number, month: number) =>
    ['month-shifts', year, month] as const;

export const useGetShifts = ({ year, month }: GetShiftsParams) => {
    const ownerId = useOwnerId();
    const setOwnerId = useUserStore(s => s.setOwnerId);

    return useQuery<GetShiftsResponse>({
        queryKey: monthShiftsKey(year, month),
        queryFn: async ({ signal }) => {
            try {
                const { data } = await api.get<GetShiftsResponse>(ENDPOINTS.getShiftsByMonth, {
                    params: { year, month, ownerId },
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

'use client';
import {useLaunchParams} from "@tma.js/sdk-react";
import {useUserStore} from "@/entities/user";

export const useOwnerId = () => {
    const userId = useUserStore(s => s.ownerId ?? s.user?.id);
    const lp = useLaunchParams(true);

    return String(userId ?? lp.tgWebAppData?.user?.id);
}
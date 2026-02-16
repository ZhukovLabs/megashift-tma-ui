'use client';
import {useUserStore} from "@/store/user-store";
import {useLaunchParams} from "@tma.js/sdk-react";

export const useOwnerId = () => {
    const userId = useUserStore(s => s.ownerId ?? s.user?.id);
    const lp = useLaunchParams(true);

    return String(userId ?? lp.tgWebAppData?.user?.id);
}
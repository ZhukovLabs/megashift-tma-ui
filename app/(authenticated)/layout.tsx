'use client';

import {ReactNode, useEffect, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {
    Calendar,
    User,
    Settings2,
    ClipboardClock,
    ChartNoAxesCombined,
} from 'lucide-react';

import {BottomMenu} from '@/components/bottom-menu';
import {useUserStore} from '@/store/user-store';
import {ROUTES} from '@/constants/routes';
import {useLaunchParams} from '@tma.js/sdk-react';
import {useProcessInvite} from '@/hooks/use-process-invite';
import {usePrefetch} from '@/hooks/use-prefetch';

const bottomMenuItems = [
    {path: ROUTES.schedule, icon: <Calendar size={24}/>},
    {path: ROUTES.shifts, icon: <ClipboardClock size={24}/>},
    {path: ROUTES.statistics, icon: <ChartNoAxesCombined size={24}/>},
    {path: ROUTES.profile, icon: <User size={24}/>},
    {path: ROUTES.settings, icon: <Settings2 size={24}/>},
];

const PREFETCH_ROUTES = [
    ROUTES.schedule,
    ROUTES.shifts,
    ROUTES.profile,
];

export default function Layout({children}: { children: ReactNode }) {
    const user = useUserStore((s) => s.user);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const launchParams = useLaunchParams();

    const inviteId = launchParams?.tgWebAppStartParam ??
        searchParams.get('startapp') ??
        null;

    const {isProcessing: isInviteProcessing} = useProcessInvite({
        inviteId,
        isLoadingUser: !user,
    });

    const currentUrl = useMemo(() => {
        const query = searchParams.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!user && !isInviteProcessing) {
            const params = new URLSearchParams({redirect: currentUrl});
            router.replace(`${ROUTES.root}?${params.toString()}`);
        }
    }, [user, isInviteProcessing, currentUrl, router]);

    usePrefetch({
        urls: PREFETCH_ROUTES,
        enabled: Boolean(user),
    });

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-spinner loading-xl"/>
            </div>
        );
    }

    return (
        <>
            {children}
            <BottomMenu items={bottomMenuItems}/>
        </>
    );
}

'use client';

import {useEffect} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {BottomMenu} from '@/components/bottom-menu';
import {Calendar, User, Settings2, ClipboardClock, ChartNoAxesCombined} from 'lucide-react';
import {useUserStore} from '@/store/user-store';
import {ROUTES} from '@/constants/routes';


const bottomMenuItems = [
    {
        path: ROUTES.schedule,
        icon: <Calendar size={24}/>,
    },
    {
        path: ROUTES.shifts,
        icon: <ClipboardClock size={24}/>,
    },
    {
        path: ROUTES.statistics,
        icon: <ChartNoAxesCombined size={24}/>,
    },
    {
        path: ROUTES.profile,
        icon: <User size={24}/>,
    },
    {
        path: ROUTES.settings,
        icon: <Settings2 size={24}/>,
    },
];

export default function Layout({children}: { children: React.ReactNode }) {
    const user = useUserStore((s) => s.user);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!user) {
            const currentUrl =
                pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            const params = new URLSearchParams({redirect: currentUrl});
            router.replace(`${ROUTES.root}?${params.toString()}`);
        }
    }, [user, router, pathname, searchParams]);

    if (!user)
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-spinner loading-xl"/>
            </div>
        );

    return (
        <>
            {children}

            <BottomMenu items={bottomMenuItems}/>
        </>
    );
}

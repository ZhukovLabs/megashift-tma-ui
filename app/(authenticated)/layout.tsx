'use client';

import {useEffect} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {BottomMenu} from '@/components/bottom-menu';
import {Calendar, User} from 'lucide-react';
import {useUserStore} from '@/store/user-store';
import {Routes} from '@/constants/routes';

export default function Layout({children}: { children: React.ReactNode }) {
    const user = useUserStore(s => s.user);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!user) {
            const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

            const params = new URLSearchParams({redirect: currentUrl});

            router.replace(`${Routes.root}?${params.toString()}`);
        }
    }, [user, router, pathname, searchParams]);

    if (!user) return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );

    return (
        <>
            {children}
            <BottomMenu
                items={[
                    {
                        path: Routes.schedule,
                        icon: <Calendar size={24}/>,
                    },
                    {
                        path: Routes.profile,
                        icon: <User size={24}/>,
                    },
                ]}
            />
        </>
    );
}

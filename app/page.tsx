'use client';

import {useLaunchParams} from '@tma.js/sdk-react';
import {useSyncRegisteredUser} from '@/components/start-form/hooks/use-sync-registered-user';
import {useSearchParams, useRouter} from 'next/navigation';
import {ROUTES} from '@/constants/routes';
import {useUserStore} from '@/store/user-store';
import {useEffect} from 'react';

const RootPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const launchParams = useLaunchParams();

    const {isLoading} = useSyncRegisteredUser();
    const user = useUserStore(s => s.user);

    const startapp = searchParams.get('startapp') ?? null;
    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (isLoading || !user) return;

        const url = new URL(redirect || ROUTES.schedule, window.location.origin);
        if (startapp) {
            url.searchParams.set('startapp', startapp);
        }

        router.replace(url.pathname + url.search);
    }, [isLoading, user, redirect, router, startapp]);

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );
};

export default RootPage;

'use client';

import {useSyncRegisteredUser} from '@/components/start-form/hooks/use-sync-registered-user';
import {useSearchParams, useRouter} from 'next/navigation';
import {ROUTES} from '@/constants/routes';
import {useUserStore} from '@/store/user-store';
import {useEffect} from 'react';
import {usePrefetch} from "@/hooks/use-prefetch";

const RootPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useUserStore(s=>s.user);

    const {isLoading} = useSyncRegisteredUser();

    const startapp = searchParams.get('startapp') ?? null;
    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (isLoading) return;

        const url = new URL(user ? (redirect || ROUTES.schedule) : ROUTES.onboarding, window.location.origin);
        if (startapp) {
            url.searchParams.set('startapp', startapp);
        }

        router.replace(url.pathname + url.search);
    }, [isLoading, redirect, router, startapp, user]);

    usePrefetch({urls: [ROUTES.schedule]});

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );
};

export default RootPage;

'use client';

import {useEffect, useMemo} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {ROUTES} from '@/constants/routes';
import {useUserStore} from '@/store/user-store';
import {useSyncRegisteredUser} from '@/components/start-form/hooks/use-sync-registered-user';
import {usePrefetch} from '@/hooks/use-prefetch';

const RootPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useUserStore((s) => s.user);

    const {isLoading} = useSyncRegisteredUser();

    const startapp = searchParams.get('startapp');
    const redirect = searchParams.get('redirect');

    usePrefetch({urls: [ROUTES.onboarding, ROUTES.schedule]});

    const redirectUrl = useMemo(() => {
        if (isLoading) return null;

        const target = user ? redirect || ROUTES.schedule : ROUTES.onboarding;
        const url = new URL(target, window.location.origin);

        if (startapp) url.searchParams.set('startapp', startapp);
        return url.pathname + url.search;
    }, [isLoading, user, redirect, startapp]);

    useEffect(() => {
        if (redirectUrl) {
            router.replace(redirectUrl);
        }
    }, [redirectUrl, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );
};

export default RootPage;

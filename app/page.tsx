'use client';

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {ROUTES} from '@/constants/routes';
import {useSyncRegisteredUser} from '@/api-hooks/auth';
import {useUserStore} from '@/store/user-store';
import {SkeletonPage} from "@/components/skeleton-page";

export default function RootPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const startapp = searchParams.get('startapp');
    const redirectParam = searchParams.get('redirect');

    const {user, isFetching} = useSyncRegisteredUser();
    const initialize = useUserStore((s) => s.initialize);

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isFetching) return;

        if (user) {
            const target = redirectParam || ROUTES.schedule;
            const url = new URL(target, window.location.origin);
            if (startapp) url.searchParams.set('startapp', startapp);
            router.replace(url.pathname + url.search);
            return;
        }

        const onboardingUrl = new URL(ROUTES.onboarding, window.location.origin);
        if (redirectParam) onboardingUrl.searchParams.set('redirect', redirectParam);
        if (startapp) onboardingUrl.searchParams.set('startapp', startapp);
        router.replace(onboardingUrl.pathname + onboardingUrl.search);
    }, [user, isFetching, redirectParam, startapp, router]);

    return <SkeletonPage/>;
}

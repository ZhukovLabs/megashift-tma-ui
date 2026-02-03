'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUserStore} from '@/store/user-store';
import {useSyncRegisteredUser} from '@/components/start-form/hooks/use-sync-registered-user';
import {URLS} from '@/constants/urls';

const RootPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useUserStore(s => s.user);
    const {isLoading} = useSyncRegisteredUser();

    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (isLoading) return;

        if (user) {
            router.replace(redirect || URLS.schedule);
        } else {
            router.replace(URLS.onboarding);
        }
    }, [user, isLoading, redirect, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );
}

export default RootPage;

'use client';

import dynamic from 'next/dynamic';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useUserStore} from '@/entities/user';
import {ROUTES} from '@/shared/constants/routes';
import {SkeletonPage} from '@/shared/ui/skeleton-page';

const StartForm = dynamic(
    () => import('@/features/auth/ui/start-form').then((m) => m.StartForm),
    {ssr: false}
);

export function OnboardingPage() {
    const router = useRouter();
    const isInitialized = useUserStore((s) => s.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            router.replace(ROUTES.root);
        }
    }, [isInitialized, router]);

    if (!isInitialized) {
        return <SkeletonPage/>;
    }

    return <StartForm/>;
}

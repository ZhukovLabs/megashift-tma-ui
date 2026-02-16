'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { ROUTES } from '@/constants/routes';
import { SkeletonPage } from '@/components/skeleton-page';

const StartForm = dynamic(
    () => import('@/components/start-form').then((m) => m.StartForm),
    { ssr: false }
);

export default function WelcomeClient() {
    const router = useRouter();
    const isInitialized = useUserStore((s) => s.isInitialized);
    const user = useUserStore((s) => s.user);

    useEffect(() => {
        if (!isInitialized || !user) {
            router.replace(ROUTES.root);
        }
    }, [isInitialized, user, router]);

    if (!isInitialized || !user) {
        return <SkeletonPage />;
    }

    return <StartForm />;
}

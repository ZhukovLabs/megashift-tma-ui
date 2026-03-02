'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {useUserStore} from '@/entities/user';
import { ROUTES } from '@/constants/routes';
import { SkeletonPage } from '@/components/skeleton-page';

export function AuthGate({ children }: { children: ReactNode }) {
    const user = useUserStore((s) => s.user);
    const isInitialized = useUserStore((s) => s.isInitialized);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isInitialized && user) return;

        const redirectUrl = new URL(ROUTES.root, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        redirectUrl.searchParams.set('redirect', pathname);

        searchParams.forEach((value, key) => {
            redirectUrl.searchParams.set(key, value);
        });

        router.replace(redirectUrl.pathname + redirectUrl.search);
    }, [isInitialized, user, pathname, searchParams, router]);

    if (!isInitialized || !user) {
        return <SkeletonPage />;
    }

    return <>{children}</>;
}

'use client';

import { useLaunchParams } from '@tma.js/sdk-react';
import { useSyncRegisteredUser } from '@/components/start-form/hooks/use-sync-registered-user';
import { useProcessInvite } from '@/hooks/use-process-invite';
import { useSearchParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useUserStore } from '@/store/user-store';
import { useEffect } from 'react';

const RootPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const launchParams = useLaunchParams();

    const { isLoading } = useSyncRegisteredUser();
    const user = useUserStore(s => s.user);

    const inviteId = launchParams?.tgWebAppStartParam ?? null;
    const redirect = searchParams.get('redirect');

    const { isProcessing } = useProcessInvite({
        inviteId,
        isLoadingUser: isLoading,
    });

    useEffect(() => {
        if (isLoading || isProcessing) return;

        if (user) {
            router.replace(redirect || ROUTES.schedule);
        } else {
            router.replace(ROUTES.onboarding);
        }
    }, [isLoading, isProcessing, user, redirect, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl" />
        </div>
    );
};

export default RootPage;

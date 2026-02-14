'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUserStore} from '@/store/user-store';
import {useSyncRegisteredUser} from '@/components/start-form/hooks/use-sync-registered-user';
import {ROUTES} from '@/constants/routes';
import {useLaunchParams} from "@tma.js/sdk-react";
import {api} from "@/lib/axios";

const RootPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useUserStore(s => s.user);
    const {isLoading} = useSyncRegisteredUser();
    const launchParams = useLaunchParams();

    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (isLoading) return;

        const redisId = launchParams.tgWebAppStartParam;
        if (redisId) {
            (async () => {
                try {
                    const { data } = await api.get(`/api/users/invite/${redisId}`);
                    alert(`Invite данные:\nID: ${data.id}\nOwner: ${data.owner}\nТип: ${data.type}\nСоздано: ${new Date(data.createdAt).toLocaleString()}`);
                } catch (err) {
                    console.error('Ошибка при получении invite:', err);
                }
            })();
        }
        
        if (user) {
            router.replace(redirect || ROUTES.schedule);
        } else {
            router.replace(ROUTES.onboarding);
        }
    }, [user, isLoading, redirect, router, launchParams.tgWebAppStartParam]);

    return (
        <div className="flex h-screen items-center justify-center">
            <span className="loading loading-spinner loading-xl"/>
        </div>
    );
}

export default RootPage;

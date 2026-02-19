'use client';

import {ReactNode, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLaunchParams} from '@tma.js/sdk-react';
import {popup} from '@tma.js/sdk';
import {useInviteProcessor} from '@/hooks/use-invite-processor';
import {useUserStore} from '@/store/user-store';
import {ACCESS_CLAIM_LABELS} from "@/constants/access-claim-labels";

export function InviteGate({children}: { children: ReactNode }) {
    const user = useUserStore((s) => s.user);

    const launchParams = useLaunchParams(true);
    const searchParams = useSearchParams();

    const inviteId = launchParams?.tgWebAppStartParam ?? searchParams.get('startapp') ?? null;
    const {state, inviterName, claims, processInvite, reset} = useInviteProcessor(inviteId, user?.id);

    useEffect(() => {
        if (!user || (state !== 'ready' && state !== 'done')) return;

        const run = async () => {
            if (state === 'done') {
                popup.show({
                    title: 'Приглашение',
                    message: 'Приглашение устарело'
                })
                return;
            }

            if (!inviterName || !claims) return;
            const message = `${inviterName} пригласил вас к своему расписанию\n\nДоступ: ${claims.map(
                (claim) => ACCESS_CLAIM_LABELS[claim]?.toLowerCase()
            ).join(', ')}.`;
            const choice = await popup.show({
                title: 'Приглашение',
                message,
                buttons: [
                    {id: 'accept', type: 'default', text: 'Принять'},
                    {id: 'decline', type: 'destructive', text: 'Отклонить'},
                ],
            });

            if (choice === 'accept') await processInvite();
            reset();
        };

        run();
    }, [state, inviterName, claims, processInvite, reset, user]);

    return <>{children}</>;
}

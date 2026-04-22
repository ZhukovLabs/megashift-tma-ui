'use client';

import {ReactNode, useEffect, useRef, useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLaunchParams} from '@tma.js/sdk-react';
import {popup} from '@tma.js/sdk';
import {useInviteProcessor} from '@/features/invite/model';
import {useUserStore} from '@/entities/user';
import { ACCESS_CLAIM_KEYS } from '@/entities/access';
import {useTranslations} from 'next-intl';

type PopupChoice = 'accept' | 'decline' | string | null;

export function InviteGate({children}: {children: ReactNode}) {
    const t = useTranslations();
    const user = useUserStore((s) => s.user);

    const launchParams = useLaunchParams(true);
    const searchParams = useSearchParams();

    const inviteId = useMemo(
        () => launchParams?.tgWebAppStartParam ?? searchParams.get('startapp') ?? null,
        [launchParams, searchParams]
    );

    const {state, inviterName, claims, processInvite, reset} = useInviteProcessor(inviteId, user?.id);

    const shownRef = useRef(false);

    const formattedClaims = useMemo(() => {
        if (!claims || claims.length === 0) return '';
        return claims
            .map((c) => t(ACCESS_CLAIM_KEYS[c]))
            .filter(Boolean)
            .map((s) => s!.toLowerCase())
            .join(', ');
    }, [claims, t]);

    useEffect(() => {
        if (!user || shownRef.current || (state !== 'ready' && state !== 'done')) return;

        let cancelled = false;
        shownRef.current = true;

        const safeShow = async (options: Parameters<typeof popup.show>[0]) => {
            try {
                return (await popup.show(options)) as PopupChoice;
            } catch (err) {
                console.error('popup.show failed', err);
                return null;
            }
        };

        (async () => {
            if (state === 'done') {
                await safeShow({
                    title: t('invite.title'),
                    message: t('invite.expired'),
                });

                return;
            }

            if (!inviterName || !claims || !formattedClaims) return;

            const message = t('invite.message', {name: inviterName, claims: formattedClaims});

            const choice = await safeShow({
                title: t('invite.title'),
                message,
                buttons: [
                    {id: 'accept', type: 'default', text: t('invite.accept')},
                    {id: 'decline', type: 'destructive', text: t('invite.decline')},
                ],
            });

            if (cancelled) return;

            if (choice === 'accept') {
                try {
                    await processInvite();
                } catch (err) {
                    console.error('processInvite failed', err);
                } finally {
                    reset();
                }
            } else {
                reset();
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [state, inviterName, formattedClaims, processInvite, reset, user]);

    return <>{children}</>;
}

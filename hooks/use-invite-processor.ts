import {useEffect, useState} from 'react';
import {useCheckInvite, useConsumeInvite} from '@/api-hooks/users/invites';
import axios from "axios";
import {AccessClaim} from "@/types";

type InviteState =
    | 'idle'
    | 'checking'
    | 'ready'
    | 'consuming'
    | 'done'
    | 'error';

export function useInviteProcessor(
    inviteId: string | null,
    userId?: string
) {
    const {mutateAsync: checkInvite} = useCheckInvite();
    const {mutateAsync: consumeInvite} = useConsumeInvite();

    const [state, setState] = useState<InviteState>('idle');
    const [inviterName, setInviterName] = useState<string | null>(null);
    const [claims, setClaims] = useState<(keyof typeof AccessClaim)[] | null>(null);

    useEffect(() => {
        if (!inviteId || !userId) return;

        let cancelled = false;

        const run = async () => {
            setState('checking');

            try {
                const inviteData = await checkInvite(inviteId);

                const fullName = [
                    inviteData.inviter.surname,
                    inviteData.inviter.name,
                    inviteData.inviter.patronymic,
                ]
                    .filter(Boolean)
                    .join(' ');

                if (cancelled) return;

                setInviterName(fullName);
                setClaims(inviteData.claims);
                setState('ready');
            } catch (error) {
                if (axios.isAxiosError(error) && !error.response?.data?.exists) {
                    setState('done');
                    return;
                }
                if (!cancelled) setState('error');
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [inviteId, userId, checkInvite]);

    const processInvite = async () => {
        if (!inviteId) return;
        setState('consuming');
        await consumeInvite(inviteId);
        setState('done');
    };

    const reset = () => {
        setState('done');
        setInviterName(null);
        setClaims(null);
    };

    return {
        state,
        inviterName,
        claims,
        processInvite,
        reset,
    };
}

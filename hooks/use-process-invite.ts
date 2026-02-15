import { useEffect, useRef, useState } from 'react';
import { popup } from '@tma.js/sdk';
import { useCheckInvite, useConsumeInvite } from '@/api-hooks/users/invites';

type UseProcessInviteParams = {
    inviteId?: string | null;
    isLoadingUser: boolean;
};

export const useProcessInvite = ({ inviteId, isLoadingUser }: UseProcessInviteParams) => {
    const hasProcessedRef = useRef(false);
    const isMountedRef = useRef(true);

    const { mutateAsync: checkInviteAsync } = useCheckInvite();
    const { mutateAsync: consumeInviteAsync } = useConsumeInvite();

    const [isProcessing, setIsProcessing] = useState(false);
    const [inviteHandled, setInviteHandled] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (isLoadingUser || !inviteId || hasProcessedRef.current) return;

        hasProcessedRef.current = true;
        setIsProcessing(true);

        const process = async () => {
            try {
                const invite = await checkInviteAsync(inviteId);
                if (!invite) return;

                const choice = await popup.show({
                    title: 'Приглашение',
                    message: 'Вы хотите принять приглашение?',
                    buttons: [
                        { id: 'accept', type: 'default', text: 'Принять' },
                        { id: 'decline', type: 'destructive', text: 'Отклонить' },
                    ],
                });

                if (choice === 'accept') {
                    await consumeInviteAsync(inviteId);
                }

                if (isMountedRef.current) setInviteHandled(true);
            } catch (err: any) {
                console.error('useProcessInvite error:', err);
                if (isMountedRef.current) setError(err);
            } finally {
                if (isMountedRef.current) setIsProcessing(false);
            }
        };

        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inviteId, isLoadingUser]);

    return { isProcessing, inviteHandled, error };
};

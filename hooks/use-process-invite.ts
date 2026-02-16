import { useEffect, useRef, useState } from 'react';
import { popup } from '@tma.js/sdk';
import { useCheckInvite, useConsumeInvite } from '@/api-hooks/users/invites';
import { useUserStore } from '@/store/user-store';

interface UseProcessInviteParams {
    inviteId?: string | null;
}

export const useProcessInvite = ({ inviteId }: UseProcessInviteParams) => {
    const user = useUserStore(state => state.user);
    const hasProcessedRef = useRef(false);

    const checkInvite = useCheckInvite().mutateAsync;
    const consumeInvite = useConsumeInvite().mutateAsync;

    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!user || !inviteId || hasProcessedRef.current) {
            return;
        }

        hasProcessedRef.current = true;

        const processInvite = async () => {
            try {
                const inviteData = await checkInvite(inviteId);

                if (!inviteData?.exists) {
                    await popup.show({
                        title: 'Приглашение',
                        message: 'Приглашение устарело или недействительно',
                    });
                    return;
                }

                const { inviter, claims } = inviteData;
                const fullName = [inviter.surname, inviter.name, inviter.patronymic]
                    .filter(Boolean)
                    .join(' ');

                const message = `${fullName} пригласил вас к своему расписанию\n\nДоступ: ${claims.join(', ')}`;

                const choice = await popup.show({
                    title: 'Приглашение',
                    message,
                    buttons: [
                        { id: 'accept', type: 'default', text: 'Принять' },
                        { id: 'decline', type: 'destructive', text: 'Отклонить' },
                    ],
                });

                if (choice === 'accept') {
                    await consumeInvite(inviteId);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setIsProcessing(false);
            }
        };

        processInvite();
    }, [inviteId, user, checkInvite, consumeInvite]);

    return {
        isProcessing,
        error,
    };
};
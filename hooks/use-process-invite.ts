import { useEffect, useRef, useState } from 'react';
import { popup } from '@tma.js/sdk';
import { useCheckInvite, useConsumeInvite } from '@/api-hooks/users/invites';

type UseProcessInviteParams = {
    inviteId?: string | null;
    isLoadingUser: boolean;
};

export const useProcessInvite = ({ inviteId, isLoadingUser }: UseProcessInviteParams) => {
    const hasProcessedRef = useRef(false);

    const { mutateAsync: checkInviteAsync } = useCheckInvite();
    const { mutateAsync: consumeInviteAsync } = useConsumeInvite();

    const [isProcessing, setIsProcessing] = useState(false);
    const [inviteHandled, setInviteHandled] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (isLoadingUser || hasProcessedRef.current) return;

        hasProcessedRef.current = true;

        const processInvite = async () => {
            setIsProcessing(true);

            try {
                if (!inviteId) {
                    setInviteHandled(true);
                    return;
                }

                const response = await checkInviteAsync(inviteId);

                if (!response?.exists) {
                    setInviteHandled(true);
                    return;
                }

                const { inviter: { surname, name, patronymic }, claims } = response;
                const fullName = [surname, name, patronymic].filter(Boolean).join(' ');
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
                    await consumeInviteAsync(inviteId);
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setIsProcessing(false);
                setInviteHandled(true);
            }
        };

        processInvite();
    }, [inviteId, isLoadingUser]);

    return { isProcessing, inviteHandled, error };
};

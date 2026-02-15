import {useEffect, useRef, useState} from 'react';
import {popup} from '@tma.js/sdk';
import {useCheckInvite, useConsumeInvite} from '@/api-hooks/users/invites';

type UseProcessInviteParams = {
    inviteId?: string | null;
    isLoadingUser: boolean;
};

export const useProcessInvite = ({inviteId, isLoadingUser}: UseProcessInviteParams) => {
    const hasProcessedRef = useRef(false);
    const isMountedRef = useRef(true);

    const {mutateAsync: checkInviteAsync} = useCheckInvite();
    const {mutateAsync: consumeInviteAsync} = useConsumeInvite();

    const [isProcessing, setIsProcessing] = useState(false);
    const [inviteHandled, setInviteHandled] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (isLoadingUser || hasProcessedRef.current) return;

        hasProcessedRef.current = true;

        if (!inviteId) {
            setInviteHandled(true);
            return;
        }

        setIsProcessing(true);

        const process = async () => {
            try {
                const response = await checkInviteAsync(inviteId);

                // Если invite не существует — считаем обработанным
                if (!response?.exists) {
                    if (isMountedRef.current) setInviteHandled(true);
                    return;
                }

                const {
                    inviter: {surname, name, patronymic},
                    claims,
                } = response;

                const fullName = [surname, name, patronymic].filter(Boolean).join(' ');
                const message = `${fullName} пригласил вас к своему расписанию\n\nДоступ: ${claims.join(', ')}`;

                const choice = await popup.show({
                    title: 'Приглашение',
                    message,
                    buttons: [
                        {id: 'accept', type: 'default', text: 'Принять'},
                        {id: 'decline', type: 'destructive', text: 'Отклонить'},
                    ],
                });

                if (choice === 'accept') {
                    await consumeInviteAsync(inviteId);
                }
            } catch (err: any) {
                console.error('useProcessInvite error:', err);
                if (isMountedRef.current) setError(err);
            } finally {
                if (isMountedRef.current) setIsProcessing(false);
                if (isMountedRef.current) setInviteHandled(true);
            }
        };

        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inviteId, isLoadingUser]);

    return {isProcessing, inviteHandled, error};
};

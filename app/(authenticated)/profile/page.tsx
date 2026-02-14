'use client';

import { useGetProfile } from "./hooks/use-get-profile";
import { useCreateInvite } from "./hooks/use-create-invite";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {shareURL} from "@tma.js/sdk";

declare global {
    interface Window {
        Telegram?: any;
    }
}

export default function ProfilePage() {
    const { data: user } = useGetProfile();
    const { mutateAsync: createInvite, isPending } = useCreateInvite();

    const formatRegistrationDate = (date: string) => {
        try {
            return format(new Date(date), 'dd.MM.yyyy', { locale: ru });
        } catch {
            return 'Неизвестно';
        }
    };

    const handleShare = async () => {
        try {
            const { id } = await createInvite();

            const url = `https://t.me/megashiftbot?startapp=${id}`;

            shareURL(url, "Приглашаю тебя следить за моими сменами")
        } catch (e) {
            console.error('Invite creation failed', e);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-3">
                Профиль
            </h1>

            <div className="bg-base-200 dark:bg-base-300 rounded-xl p-6 space-y-4 shadow-md">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Фамилия:</span>
                    <span>{user?.surname || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Имя:</span>
                    <span>{user?.name || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Отчество:</span>
                    <span>{user?.patronymic || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Дата регистрации:</span>
                    <span>
                        {user?.createdAt
                            ? formatRegistrationDate(user.createdAt)
                            : 'Не указано'}
                    </span>
                </div>

                <button
                    onClick={handleShare}
                    disabled={isPending}
                    className="btn btn-primary w-full mt-4"
                >
                    {isPending ? 'Создание...' : 'Поделиться ботом'}
                </button>

                <div className="mt-6 text-sm text-base-content/50 hyphens-auto">
                    Здесь вы можете видеть вашу сводную информацию. В будущем тут будет редактирование профиля.
                </div>
            </div>
        </div>
    );
}

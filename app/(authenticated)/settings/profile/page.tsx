'use client';

import { useState } from "react";
import { useGetProfile } from "@/api-hooks/use-get-profile";
import { useCreateInvite } from "@/api-hooks/use-create-invite";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { shareURL } from "@tma.js/sdk";
import { User, Calendar, Share2 } from "lucide-react";
import { useLaunchParams } from "@tma.js/sdk-react";

export default function ProfilePage() {
    const { data: user, isLoading } = useGetProfile();
    const lp = useLaunchParams(true);
    const photoUrl = lp.tgWebAppData?.user?.photoUrl;

    const { mutateAsync: createInvite, isPending } = useCreateInvite();

    const [imgError, setImgError] = useState(false);

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
            shareURL(url, "Приглашаю тебя следить за моими сменами");
        } catch (e) {
            console.error('Invite creation failed', e);
        }
    };

    const initials = `${user?.surname?.[0] ?? ''}${user?.name?.[0] ?? ''}`;
    const fullName = [user?.surname, user?.name].filter(Boolean).join(' ');

    if (isLoading) {
        return (
            <div className="px-4 py-6 space-y-4">
                <div className="skeleton h-28 w-full rounded-2xl"></div>
                <div className="skeleton h-40 w-full rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pb-10">

            <h1 className="text-center text-2xl font-bold tracking-tight mb-4">
                Профиль
            </h1>

            <div className="flex flex-col items-center rounded-2xl bg-base-100 p-6 shadow">

                <div className="relative h-24 w-24">
                    {photoUrl && !imgError ? (
                        <img
                            src={photoUrl}
                            alt="Аватар пользователя"
                            onError={() => setImgError(true)}
                            className="h-24 w-24 rounded-full object-cover shadow-md"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content shadow-md">
                            {initials || <User size={36} />}
                        </div>
                    )}
                </div>

                <div className="mt-4 text-lg font-semibold text-center">
                    {fullName || 'Не указано'}
                </div>

                {user?.patronymic && (
                    <div className="text-sm text-base-content/60">
                        {user.patronymic}
                    </div>
                )}
            </div>

            {/* Registration */}
            <div className="mt-6 rounded-2xl bg-base-100 shadow">
                <div className="flex items-center gap-4 px-4 py-4">
                    <Calendar size={20} className="text-primary shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-sm text-base-content/60">
                            Дата регистрации
                        </span>
                        <span className="font-medium">
                            {user?.createdAt
                                ? formatRegistrationDate(user.createdAt)
                                : 'Не указано'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Share */}
            <div className="mt-6 rounded-2xl bg-base-100 p-4 shadow">
                <button
                    onClick={handleShare}
                    disabled={isPending}
                    className="btn btn-primary w-full gap-2"
                >
                    <Share2 size={18} />
                    {isPending ? 'Создание ссылки...' : 'Поделиться ботом'}
                </button>

                <p className="mt-3 text-xs text-base-content/50 text-center">
                    Отправьте приглашение и позвольте другим следить за вашими сменами
                </p>
            </div>
        </div>
    );
}

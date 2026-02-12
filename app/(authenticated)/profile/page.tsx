'use client';

import {useGetProfile} from "./hooks/use-get-profile";
import {format} from "date-fns";
import {ru} from "date-fns/locale";

export default function ProfilePage() {
    const {data: user} = useGetProfile();

    const formatRegistrationDate = (date: string) => {
        try {
            return format(date, 'dd.MM.yyyy', {locale: ru});
        } catch {
            return 'Неизвестно';
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
                    <span className="text-base-content">{user?.surname || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Имя:</span>
                    <span className="text-base-content">{user?.name || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Отчество:</span>
                    <span className="text-base-content">{user?.patronymic || 'Не указано'}</span>
                </div>
                <div className="divider my-0"></div>

                {/* Добавляем дату регистрации */}
                <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content/60">Дата регистрации:</span>
                    <span className="text-base-content">
                        {user?.createdAt ? formatRegistrationDate(user.createdAt) : 'Не указано'}
                    </span>
                </div>

                <div className="mt-6 text-sm text-base-content/50 hyphens-auto">
                    Здесь вы можете видеть вашу сводную информацию. В будущем тут будет редактирование профиля.
                </div>
            </div>
        </div>
    );
}
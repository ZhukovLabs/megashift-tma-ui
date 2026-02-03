'use client';

import {useUserStore} from '@/store/user-store';

export default function ProfilePage() {
    const user = useUserStore(s => s.user); // { name, surname, patronymic? }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-base-content">
                Настройки профиля
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

                <div className="mt-6 text-sm text-base-content/50 hyphens-auto">
                    Здесь вы можете видеть вашу сводную информацию. В будущем тут будет редактирование профиля.
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useUserStore } from "@/store/user-store"; // путь к вашему стора

export default function CalendarSettingsPage() {
    const userId = useUserStore((s) => s.user?.id ?? '');
    const [selectedUser, setSelectedUser] = useState(userId);
    const setOwnerId = useUserStore((s) => s.setOwnerId);

    const accessibleUsers = [
        { id: userId, fullName: "Мой календарь" },
        { id: "user1", fullName: "Иван Иванов" },
        { id: "user2", fullName: "Мария Петрова" },
    ];

    const claimsMap: Record<string, { label: string; hasAccess: boolean }[]> = {
        [userId]: [
            { label: "Просмотр (READ)", hasAccess: true },
            { label: "Редактирование своих смен (EDIT_SELF)", hasAccess: true },
            { label: "Редактирование чужих смен (EDIT_OWNER)", hasAccess: true },
            { label: "Удаление своих смен (DELETE_SELF)", hasAccess: true },
            { label: "Удаление чужих смен (DELETE_OWNER)", hasAccess: true },
        ],
        user1: [
            { label: "Просмотр (READ)", hasAccess: true },
            { label: "Редактирование своих смен (EDIT_SELF)", hasAccess: true },
            { label: "Редактирование чужих смен (EDIT_OWNER)", hasAccess: false },
            { label: "Удаление своих смен (DELETE_SELF)", hasAccess: false },
            { label: "Удаление чужих смен (DELETE_OWNER)", hasAccess: false },
        ],
        user2: [
            { label: "Просмотр (READ)", hasAccess: true },
            { label: "Редактирование своих смен (EDIT_SELF)", hasAccess: false },
            { label: "Редактирование чужих смен (EDIT_OWNER)", hasAccess: false },
            { label: "Удаление своих смен (DELETE_SELF)", hasAccess: false },
            { label: "Удаление чужих смен (DELETE_OWNER)", hasAccess: false },
        ],
    };

    const currentClaims = claimsMap[selectedUser] || [];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedUser(value);
        setOwnerId(value); // сохраняем выбранный ownerId в стор
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pb-10">
            <h1 className="text-center text-2xl font-bold tracking-tight mb-6">
                Настройка календаря
            </h1>

            <div className="rounded-2xl bg-base-100 p-6 shadow max-w-md mx-auto space-y-4">
                <label className="block text-base font-medium">
                    Выберите календарь для просмотра:
                </label>

                <select
                    className="select select-bordered w-full"
                    value={selectedUser}
                    onChange={handleChange}
                >
                    {accessibleUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.fullName}
                        </option>
                    ))}
                </select>

                <div className="mt-4 space-y-2">
                    {currentClaims.map((claim) => (
                        <div
                            key={claim.label}
                            className="flex items-center gap-2 text-sm text-base-content"
                        >
                            {claim.hasAccess ? (
                                <Check size={16} className="text-green-500" />
                            ) : (
                                <X size={16} className="text-red-500" />
                            )}
                            <span>{claim.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

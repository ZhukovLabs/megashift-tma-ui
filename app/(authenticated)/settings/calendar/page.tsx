"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useGetAccess } from "@/api-hooks/users/invites";
import {AccessUser} from "@/api-hooks/users/invites/use-get-access";
import {AccessClaim} from "@/types";

export default function CalendarSettingsPage() {
    const userId = useUserStore((s) => s.user?.id ?? "");
    const setOwnerId = useUserStore((s) => s.setOwnerId);

    const { data: accessData, isLoading } = useGetAccess();

    const [selectedUser, setSelectedUser] = useState(userId);
    const [accessibleUsers, setAccessibleUsers] = useState<AccessUser[]>([]);

    useEffect(() => {
        if (accessData) {
            const me: AccessUser = {
                id: userId,
                name: "Мой календарь",
                surname: "",
                claims: Object.values(AccessClaim),
            };
            setAccessibleUsers([me, ...accessData]);
        }
    }, [accessData, userId]);

    // текущие клеймы выбранного пользователя
    const currentClaims: { label: string; hasAccess: boolean }[] =
        accessibleUsers.find((u) => u.id === selectedUser)?.claims.map((c) => ({
            label: c,
            hasAccess: true,
        })) || [];

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
                    disabled={isLoading}
                >
                    {accessibleUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} {user.surname}
                        </option>
                    ))}
                </select>

                <div className="mt-4 space-y-2">
                    {currentClaims.length > 0 ? (
                        currentClaims.map((claim) => (
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
                        ))
                    ) : (
                        <p className="text-sm text-base-content/50">Нет доступных прав</p>
                    )}
                </div>
            </div>
        </div>
    );
}

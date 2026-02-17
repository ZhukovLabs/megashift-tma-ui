"use client";

import {ChangeEvent, useEffect, useMemo} from "react";
import { Check } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useGetAvailableCalendars } from "@/api-hooks/users/invites";
import { AccessUser } from "@/api-hooks/users/invites/use-get-available-calendars";
import { AccessClaim } from "@/types";

export default function CalendarSettingsPage() {
    const userId = useUserStore((s) => s.user?.id ?? "");
    const ownerId = useUserStore((s) => s.ownerId);
    const setOwnerId = useUserStore((s) => s.setOwnerId);

    const { data: accessData = [], isLoading } = useGetAvailableCalendars();

    const accessibleUsers: AccessUser[] = useMemo(() => {
        const me: AccessUser = {
            id: userId,
            name: "Мой календарь",
            surname: "",
            claims: Object.values(AccessClaim),
        };
        return [me, ...accessData];
    }, [userId, accessData]);

    const selectedUserId = useMemo(() => {
        const ownerIsValid = ownerId && accessibleUsers.some((u) => u.id === ownerId);
        return ownerIsValid ? ownerId : userId;
    }, [ownerId, accessibleUsers, userId]);

    useEffect(() => {
        const ownerIsValid = ownerId && accessibleUsers.some((u) => u.id === ownerId);
        const desiredOwner = ownerIsValid ? ownerId : userId;

        if (ownerId !== desiredOwner) {
            setOwnerId(desiredOwner);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerId, accessibleUsers, userId, setOwnerId]);

    const selectedUser = useMemo(
        () => accessibleUsers.find((u) => u.id === selectedUserId),
        [accessibleUsers, selectedUserId]
    );

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setOwnerId(e.target.value);
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
                    value={selectedUserId}
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
                    {selectedUser?.claims?.length ? (
                        selectedUser.claims.map((claim) => (
                            <div
                                key={claim}
                                className="flex items-center gap-2 text-sm text-base-content"
                            >
                                <Check size={16} className="text-green-500" />
                                <span>{claim}</span>
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

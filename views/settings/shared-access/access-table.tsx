"use client";

import {useState} from "react";
import { AccessClaim } from '@/entities/access';
import {useUpdateAccess, useRevokeAllAccess} from "@/features/user/api";
import {Trash2, Save, ChevronDown} from "lucide-react";
import {toast} from "react-toastify";
import {useTranslations} from 'next-intl';

type AccessUser = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string | null;
    claims: AccessClaim[];
};

type Props = {
    users: AccessUser[];
};

export function AccessTable({users}: Props) {
    const t = useTranslations('sharedAccess');
    const tClaims = useTranslations('accessClaims');
    const {mutateAsync: updateAccess, isPending: isUpdating} = useUpdateAccess();
    const {mutateAsync: revokeAll, isPending: isDeleting} = useRevokeAllAccess();

    const [edited, setEdited] = useState<Record<string, AccessClaim[]>>({});
    const [openUser, setOpenUser] = useState<string | null>(null);

    const handleToggle = (userId: string, claim: AccessClaim) => {
        const current =
            edited[userId] ??
            users.find(u => u.id === userId)?.claims ??
            [];

        const exists = current.includes(claim);
        const updated = exists
            ? current.filter(c => c !== claim)
            : [...current, claim];

        setEdited(prev => ({
            ...prev,
            [userId]: updated
        }));
    };

    const handleSave = async (userId: string) => {
        try {
            const claims = edited[userId];
            if (!claims) return;

            await updateAccess({
                targetUserId: userId,
                claims
            });

            toast.success(t('accessUpdated'));
            setOpenUser(null);
        } catch {
            toast.error(t('accessUpdateError'));
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm(t('deleteConfirm'))) return;

        try {
            await revokeAll(userId);
            toast.success(t('accessDeleted'));
        } catch {
            toast.error(t('deleteError'));
        }
    };

    if (!users?.length) {
        return (
            <div className="mt-8 text-center text-sm text-base-content/60">
                {t('noUsers')}
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-5">
            <h2 className="font-medium text-base-content mb-2 block">{t('usersTitle')}</h2>

            {users.map((user) => {
                const currentClaims = edited[user.id] ?? user.claims;
                const isOpen = openUser === user.id;

                const initials =
                    `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();

                return (
                    <div
                        key={user.id}
                        className="rounded-2xl bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200"
                    >
                        <div
                            onClick={() =>
                                setOpenUser(isOpen ? null : user.id)
                            }
                            className="flex items-center justify-between p-4 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                    {initials}
                                </div>

                                <div>
                                    <div className="font-medium text-sm">
                                        {user.surname} {user.name}
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {currentClaims.map(claim => (
                                            <span
                                                key={claim}
                                                className="badge badge-primary badge-soft badge-xs"
                                            >
                                                {tClaims(claim)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <ChevronDown
                                size={18}
                                className={`text-base-content/60 transition-transform duration-200 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        <div
                            className={`grid transition-all duration-300 ${
                                isOpen
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden border-t border-base-200 px-4 pb-4 space-y-4">
                                <div className="pt-4 flex flex-col gap-3">
                                    {Object.values(AccessClaim).map(claim => {
                                        const isChecked =
                                            currentClaims.includes(claim);
                                        const isRead =
                                            claim === AccessClaim.READ;

                                        return (
                                            <label
                                                key={claim}
                                                className="flex items-center justify-between bg-base-200/40 hover:bg-base-200 rounded-xl px-3 py-2 transition-colors"
                                            >
                                                <span className="text-sm">
                                                    {tClaims(claim)}
                                                </span>

                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-primary toggle-sm"
                                                    checked={isChecked}
                                                    disabled={isRead}
                                                    onChange={() =>
                                                        handleToggle(user.id, claim)
                                                    }
                                                />
                                            </label>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        className="btn btn-primary btn-sm flex-1 gap-2"
                                        disabled={isUpdating}
                                        onClick={() => handleSave(user.id)}
                                    >
                                        <Save size={16}/>
                                        {t('saveButton')}
                                    </button>

                                    <button
                                        className="btn btn-error btn-outline btn-sm"
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

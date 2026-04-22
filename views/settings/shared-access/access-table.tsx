"use client";

import {useState} from "react";
import { useTranslations } from "next-intl";
import { AccessClaim, ACCESS_CLAIM_LABELS } from '@/entities/access';
import {useUpdateAccess, useRevokeAllAccess} from "@/features/user/api";
import {Trash2, Save, ChevronDown, UserCircle2, Shield} from "lucide-react";
import {toast} from "react-toastify";
import cn from "classnames";
import {motion, AnimatePresence} from "framer-motion";

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
    const t = useTranslations('settings.sharedAccess');
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
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-base-200/20 rounded-[32px] border-2 border-dashed border-base-200">
                <UserCircle2 size={40} className="text-base-content/10 mb-3" />
                <span className="text-sm font-bold text-base-content/20 uppercase tracking-widest text-center">{t('noAccess')}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-base-content/40">{t('haveAccess')}</h2>
            </div>

            <div className="space-y-3">
                {users.map((user) => {
                    const currentClaims = edited[user.id] ?? user.claims;
                    const isOpen = openUser === user.id;

                    const initials =
                        `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();

                    return (
                        <div
                            key={user.id}
                            className={cn(
                                "rounded-[32px] bg-base-100 border transition-all duration-300",
                                isOpen ? "border-primary/20 shadow-lg" : "border-base-200 shadow-sm"
                            )}
                        >
                            <div
                                onClick={() =>
                                    setOpenUser(isOpen ? null : user.id)
                                }
                                className="flex items-center justify-between p-4 pl-5 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="shrink-0 w-12 h-12 rounded-[18px] bg-primary/5 text-primary flex items-center justify-center text-base font-black shadow-inner">
                                        {initials}
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="font-bold text-base text-base-content/90">
                                            {user.surname} {user.name}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {currentClaims.map(claim => (
                                                <span
                                                    key={claim}
                                                    className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-primary/10 text-primary"
                                                >
                                                    {ACCESS_CLAIM_LABELS[claim]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                    isOpen ? "bg-primary text-primary-content" : "bg-base-200/50 text-base-content/20"
                                )}>
                                    <ChevronDown
                                        size={20}
                                        strokeWidth={3}
                                        className={cn("transition-transform duration-300", isOpen && "rotate-180")}
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-6 pt-2 space-y-5">
                                            <div className="h-px bg-base-200/60 w-full" />
                                            
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/20 ml-1">{t('rightsManagement')}</span>
                                                {Object.values(AccessClaim).map(claim => {
                                                    const isChecked = currentClaims.includes(claim);
                                                    const isRead = claim === AccessClaim.READ;

                                                    return (
                                                        <label
                                                            key={claim}
                                                            className={cn(
                                                                "flex items-center justify-between p-4 rounded-2xl transition-all",
                                                                isChecked ? "bg-primary/5" : "bg-base-200/30"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "text-sm font-bold",
                                                                isChecked ? "text-base-content" : "text-base-content/40"
                                                            )}>
                                                                {ACCESS_CLAIM_LABELS[claim]}
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

                                            <div className="flex gap-3">
                                                <button
                                                    className="btn btn-primary h-12 flex-1 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px]"
                                                    disabled={isUpdating}
                                                    onClick={() => handleSave(user.id)}
                                                >
                                                    <Save size={16} strokeWidth={3}/>
                                                    {t('save')}
                                                </button>

                                                <button
                                                    className="btn btn-error btn-outline h-12 w-12 p-0 rounded-2xl flex items-center justify-center border-2 active:bg-error active:text-white"
                                                    disabled={isDeleting}
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5}/>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

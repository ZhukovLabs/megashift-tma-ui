'use client';
import {useEffect, useMemo} from "react";
import {Check, X, Trash2, CalendarDays, ShieldCheck, UserCircle2} from "lucide-react";
import {useUserStore} from "@/entities/user";
import {useGetAvailableCalendars, AccessUser, useUnsubscribeFromCalendar} from "@/features/user/api";
import { ACCESS_CLAIM_LABELS, AccessClaim } from '@/entities/access';
import {popup} from "@tma.js/sdk";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslations} from "next-intl";
import cn from "classnames";

export function CalendarSettingsPage() {
    const t = useTranslations('settings.calendar');
    const userId = useUserStore((s) => s.user?.id ?? "");
    const ownerId = useUserStore((s) => s.ownerId);
    const setOwnerId = useUserStore((s) => s.setOwnerId);
    const setCurrentClaims = useUserStore((s) => s.setCurrentClaims);

    const {data: accessData = [], isLoading} = useGetAvailableCalendars();

    const {mutate: unsubscribe, isPending: isUnsubscribing} =
        useUnsubscribeFromCalendar();

    const accessibleUsers: AccessUser[] = useMemo(() => {
        const me: AccessUser = {
            id: userId,
            name: t('myCalendar'),
            surname: "",
            claims: Object.values(AccessClaim),
        };
        return [me, ...accessData];
    }, [userId, accessData, t]);

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
    }, [ownerId, accessibleUsers, userId, setOwnerId]);

    const selectedUser = useMemo(
        () => accessibleUsers.find((u) => u.id === selectedUserId),
        [accessibleUsers, selectedUserId]
    );

    useEffect(() => {
        if (!selectedUser) return;
        if (selectedUser.id === userId) {
            setCurrentClaims(null);
        } else {
            setCurrentClaims(selectedUser.claims);
        }
    }, [selectedUser, userId, setCurrentClaims]);

    const handleSelect = (id: string) => {
        setOwnerId(id);
    };

    const handleUnsubscribe = async (ownerUserId: string) => {
        const user = accessibleUsers.find((u) => u.id === ownerUserId);
        if (!user) return;

        const name = [user.name, user.surname].filter(Boolean).join(" ") || "этого пользователя";

        const confirmed = await popup.show({
            title: t('unsubscribe') + "?",
            message: `Вы действительно хотите отписаться от календаря ${name}?`,
            buttons: [
                {id: "confirm", type: "destructive" as const, text: t('unsubscribe')},
                {id: "cancel", type: "cancel" as const, text: t('cancel')},
            ],
        } as any);

        if (!confirmed || confirmed === "cancel") return;

        unsubscribe(ownerUserId);
    };

    const allClaims = Object.values(AccessClaim);

    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm text-center">
                <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                    {t('title')}
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/25 mt-1.5 leading-none">
                    {t('subtitle')}
                </p>
            </header>

            <main className="w-full px-6 max-w-xl mx-auto pt-8 pb-32 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <CalendarDays size={18} className="text-primary/40" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-base-content/30">{t('availableCalendars')}</h2>
                    </div>

                    <div className="space-y-2.5">
                        {accessibleUsers.map((user) => {
                            const isSelected = user.id === selectedUserId;
                            const isMyCalendar = user.id === userId;
                            const initials = isMyCalendar ? "M" : `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();

                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => handleSelect(user.id)}
                                    className={cn(
                                        "group relative flex cursor-pointer items-center gap-4 rounded-[28px] border p-4 transition-all duration-300",
                                        isSelected 
                                            ? "bg-primary/5 border-primary/20 shadow-md ring-1 ring-primary/10" 
                                            : "bg-base-200/30 border-base-200 hover:bg-base-200/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-inner shrink-0 transition-colors",
                                        isSelected ? "bg-primary text-primary-content" : "bg-base-100 text-base-content/30"
                                    )}>
                                        {initials}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "text-base font-bold truncate transition-colors",
                                            isSelected ? "text-base-content" : "text-base-content/60"
                                        )}>
                                            {user.name} {user.surname}
                                        </div>
                                        {isMyCalendar && (
                                            <div className="text-[9px] font-black uppercase tracking-widest text-primary/50 mt-0.5">
                                                {t('mainProfile')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isSelected && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <Check size={16} strokeWidth={4} />
                                            </div>
                                        )}

                                        {!isMyCalendar && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnsubscribe(user.id);
                                                }}
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-error/5 text-error/30 hover:bg-error hover:text-white transition-all active:scale-90"
                                            >
                                                <Trash2 size={18} strokeWidth={2.5}/>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Секция информации о правах */}
                <AnimatePresence>
                    {selectedUser && selectedUser.id !== userId && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-base-200/40 rounded-[32px] p-6 border border-base-200/60"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ShieldCheck size={20} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-base-content/80">{t('availableRights')}</h3>
                                    <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-tighter">{t('yourCapabilities')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                                {allClaims.map((claim) => {
                                    const hasAccess = selectedUser.claims.includes(claim);
                                    return (
                                        <div 
                                            key={claim} 
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl transition-all",
                                                hasAccess ? "bg-base-100 shadow-sm border border-base-200/50" : "bg-base-100/20 opacity-40 border border-transparent"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-sm font-bold",
                                                hasAccess ? "text-base-content/80" : "text-base-content/40"
                                            )}>
                                                {ACCESS_CLAIM_LABELS[claim]}
                                            </span>
                                            {hasAccess ? (
                                                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-base-200 text-base-content/20 flex items-center justify-center">
                                                    <X size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 text-base-content/20 gap-3">
                        <div className="loading loading-spinner loading-md" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('searching')}</span>
                    </div>
                )}
            </main>
        </div>
    );
}

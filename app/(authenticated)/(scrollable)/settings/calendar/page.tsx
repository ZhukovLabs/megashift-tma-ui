'use client';
import {useEffect, useMemo} from "react";
import {Check, X, Trash2} from "lucide-react";
import {useUserStore} from "@/entities/user";
import {useGetAvailableCalendars} from "@/api-hooks/user/calendar";
import {AccessUser} from "@/api-hooks/user/calendar/use-get-available-calendars";
import {ACCESS_CLAIM_LABELS} from "@/constants/access-claim-labels";
import {AccessClaim} from "@/constants/access-claim";
import {useUnsubscribeFromCalendar} from "@/api-hooks/user/calendar/use-unsubscribe-from-calendar";
import {popup} from "@tma.js/sdk";

export default function CalendarSettingsPage() {
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
            title: "Отписаться от календаря?",
            message: `Вы действительно хотите отписаться от календаря ${name}?\nДоступ будет полностью удалён.`,
            buttons: [
                {id: "cancel", type: "cancel"},
                {id: "confirm", type: "destructive", text: "Отписаться"},
            ],
        });

        if (!confirmed || confirmed === "cancel") return;

        unsubscribe(ownerUserId);
    };

    const allClaims = Object.values(AccessClaim);

    return (
        <div className="mx-auto w-full max-w-md px-4 pt-6">
            <h1 className="mb-7 text-center text-2xl font-bold tracking-tight text-base-content/90">
                Календари
            </h1>

            <div className="space-y-2.5">
                {accessibleUsers.map((user) => {
                    const isSelected = user.id === selectedUserId;
                    const isMyCalendar = user.id === userId;

                    return (
                        <div
                            key={user.id}
                            onClick={() => handleSelect(user.id)}
                            className={`
                group relative flex cursor-pointer items-center gap-3.5 
                rounded-xl border px-4 py-3.5 transition-all
                ${isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-base-300 bg-base-100 hover:border-base-300/80 hover:bg-base-100/70"}
              `}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-medium leading-tight">
                                    {user.name} {user.surname}
                                </div>
                                {isMyCalendar && (
                                    <div className="mt-0.5 text-xs text-base-content/50">
                                        мой календарь
                                    </div>
                                )}
                            </div>

                            {isSelected && (
                                <Check size={18} className="text-primary shrink-0"/>
                            )}

                            {!isMyCalendar && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnsubscribe(user.id);
                                    }}
                                    disabled={isUnsubscribing}
                                    className={`
                    btn btn-ghost btn-xs text-error 
                    ${isUnsubscribing ? "opacity-50 cursor-not-allowed" : "opacity-40 hover:opacity-100 group-hover:opacity-70"}
                  `}
                                    aria-label="Отписаться от календаря"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedUser && selectedUser.id !== userId && (
                <div className="mt-8 rounded-xl bg-base-100 p-5 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold">Доступные права</h2>
                    <div className="space-y-2.5 text-sm">
                        {allClaims.map((claim) => {
                            const hasAccess = selectedUser.claims.includes(claim);
                            return (
                                <div key={claim} className="flex items-center gap-2.5">
                                    {hasAccess ? (
                                        <Check size={16} className="text-success"/>
                                    ) : (
                                        <X size={16} className="text-error/70"/>
                                    )}
                                    <span className={hasAccess ? "" : "text-base-content/60"}>
                    {ACCESS_CLAIM_LABELS[claim]}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="mt-10 text-center text-base-content/50">
                    Загрузка календарей...
                </div>
            )}

            {isUnsubscribing && (
                <div className="mt-6 text-center text-base-content/60">
                    Отписываемся...
                </div>
            )}
        </div>
    );
}
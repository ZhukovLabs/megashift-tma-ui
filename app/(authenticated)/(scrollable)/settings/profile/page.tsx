'use client';

import { useEffect, useMemo, useState } from "react";
import { useGetProfile } from "@/api-hooks/user/profile/use-get-profile";
import { useUpdateProfile } from "@/api-hooks/user/profile/use-update-profile";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { User, Calendar, Pencil, X, Save, Globe } from "lucide-react";
import { useLaunchParams } from "@tma.js/sdk-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const schema = z.object({
    surname: z.string().min(1, "Введите фамилию").max(50),
    name: z.string().min(1, "Введите имя").max(50),
    patronymic: z.string().max(50).optional().or(z.literal("")),
    timezone: z.string().min(1, "Выберите часовой пояс"),
});

type FormValues = z.infer<typeof schema>;

const TIMEZONES = [
    { label: "UTC", tz: "UTC" },
    { label: "Минск", tz: "Europe/Minsk" },
    { label: "Москва", tz: "Europe/Moscow" },
    { label: "Лондон", tz: "Europe/London" },
    { label: "Париж", tz: "Europe/Paris" },
    { label: "Нью-Йорк", tz: "America/New_York" },
    { label: "Чикаго", tz: "America/Chicago" },
    { label: "Лос-Анджелес", tz: "America/Los_Angeles" },
    { label: "Токио", tz: "Asia/Tokyo" },
    { label: "Шанхай", tz: "Asia/Shanghai" },
    { label: "Калькутта", tz: "Asia/Kolkata" },
];

// helper: возвращает строку смещения вроде "GMT+3" или "GMT+03:00"
// использует Intl.formatToParts чтобы получить часть timeZoneName (в большинстве реализаций это "GMT+X")
function getOffsetLabel(tz: string) {
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            timeZoneName: "short",
        }).formatToParts(new Date());
        const tzPart = parts.find((p) => p.type === "timeZoneName")?.value;
        return tzPart ?? "";
    } catch {
        return "";
    }
}

// helper: возвращает локальное текущее время в зоне tz в виде "HH:MM:SS"
function getCurrentTimeInTZ(tz?: string) {
    try {
        const opts: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: tz ?? "UTC",
        };
        return new Intl.DateTimeFormat("ru-RU", opts).format(new Date());
    } catch {
        return "--:--:--";
    }
}

// форматирование даты регистрации: если есть timezone — показываем дату+время+смещение
function formatRegistrationDate(date: string, timezone?: string) {
    try {
        const d = new Date(date);
        if (timezone) {
            // dd.MM.yyyy, HH:mm (GMT+X)
            const datePart = new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: timezone,
            }).format(d);

            const timePart = new Intl.DateTimeFormat("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: timezone,
                hour12: false,
            }).format(d);

            const offset = getOffsetLabel(timezone);
            return `${datePart}, ${timePart} ${offset ? `(${offset})` : ""}`;
        }
        return format(d, "dd.MM.yyyy", { locale: ru });
    } catch {
        return "Неизвестно";
    }
}

export default function ProfilePage() {
    const { data: user, isLoading } = useGetProfile();
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

    const lp = useLaunchParams(true);
    const photoUrl = lp.tgWebAppData?.user?.photoUrl;

    const [imgError, setImgError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const defaultValues: Partial<FormValues> = {
        surname: "",
        name: "",
        patronymic: "",
        timezone: "UTC",
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
        control,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    // watch timezone from form (for live preview in edit mode)
    const watchedTimezone = useWatch({ control, name: "timezone" });

    // local clock in selected/timezone or user's timezone
    const [currentTime, setCurrentTime] = useState<string>(() =>
        getCurrentTimeInTZ(user?.timezone ?? watchedTimezone ?? "UTC")
    );

    // keep clock updated; react to changes in user's timezone or watchedTimezone
    useEffect(() => {
        // choose active tz: when editing - the form's watchedTimezone, otherwise user's saved timezone
        const activeTz = isEditing ? watchedTimezone ?? user?.timezone ?? "UTC" : user?.timezone ?? "UTC";

        // initialize immediately with active tz
        setCurrentTime(getCurrentTimeInTZ(activeTz));

        const timer = setInterval(() => {
            setCurrentTime(getCurrentTimeInTZ(activeTz));
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, watchedTimezone, user?.timezone]);

    // when user data arrives — reset form fields (including timezone)
    useEffect(() => {
        if (user) {
            reset({
                surname: user.surname ?? "",
                name: user.name ?? "",
                patronymic: user.patronymic ?? "",
                timezone: user.timezone ?? "UTC",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            await updateProfile(data);
            toast.success("Профиль обновлён");
            setIsEditing(false);
        } catch {
            toast.error("Ошибка обновления");
        }
    };

    const initials = `${user?.surname?.[0] ?? ""}${user?.name?.[0] ?? ""}`.toUpperCase();
    const fullName = [user?.surname, user?.name].filter(Boolean).join(" ");

    // pretty info for timezone display
    const displayedTz = useMemo(() => {
        const tz = isEditing ? watchedTimezone ?? user?.timezone : user?.timezone;
        const label = TIMEZONES.find((t) => t.tz === tz)?.label ?? tz ?? "UTC";
        const offset = tz ? getOffsetLabel(tz) : "";
        return { tz: tz ?? "UTC", label, offset };
    }, [isEditing, watchedTimezone, user?.timezone]);

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
            <h1 className="text-center text-2xl font-bold tracking-tight mb-4">Профиль</h1>

            <div className="mx-auto w-full max-w-3xl space-y-6">
                {/* PROFILE CARD */}
                <div className="relative overflow-hidden rounded-2xl bg-base-100 p-6 shadow-md">
                    <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-6">
                        <div className="relative flex-shrink-0">
                            <div className="h-28 w-28 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-focus shadow-lg">
                                {photoUrl && !imgError ? (
                                    <img
                                        src={photoUrl}
                                        alt="Аватар пользователя"
                                        onError={() => setImgError(true)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary-content">
                                        {initials || <User size={36} />}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-lg font-semibold">{fullName || "Не указано"}</div>
                                    {user?.patronymic && <div className="text-sm text-base-content/60">{user.patronymic}</div>}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditing((s) => !s)}
                                        className="btn btn-ghost btn-sm gap-2"
                                        title={isEditing ? "Отменить" : "Редактировать"}
                                    >
                                        {isEditing ? <X size={16} /> : <Pencil size={16} />}
                                        <span className="hidden sm:inline">{isEditing ? "Отменить" : "Редактировать"}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 rounded-md bg-base-200 px-3 py-2">
                                    <Calendar size={16} />
                                    <div className="text-xs text-base-content/60">
                                        Зарегистрирован:{" "}
                                        <span className="font-medium">
                      {user?.createdAt ? formatRegistrationDate(user.createdAt, user?.timezone) : "Не указано"}
                    </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-md bg-base-200 px-3 py-2">
                                    <Globe size={16} />
                                    <div className="text-xs text-base-content/60">
                                        Часовой пояс:{" "}
                                        <span className="font-medium">
                      {displayedTz.label} {displayedTz.offset ? `(${displayedTz.offset})` : ""}
                    </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-md bg-base-200 px-3 py-2">
                                    <div className="text-xs text-base-content/60">Сейчас:</div>
                                    <div className="font-mono font-semibold ml-2">{currentTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EDIT FORM - раскрывается */}
                    <div className={`mt-6 transition-all duration-300 ${isEditing ? "h-auto opacity-100" : "h-0 opacity-0 overflow-hidden"}`}>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Фамилия</span>
                                    </label>
                                    <input {...register("surname")} className="input input-bordered w-full" placeholder="Фамилия" />
                                    {errors.surname && <p className="text-xs text-error mt-1">{errors.surname.message}</p>}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Имя</span>
                                    </label>
                                    <input {...register("name")} className="input input-bordered w-full" placeholder="Имя" />
                                    {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Отчество (не обязательно)</span>
                                </label>
                                <input {...register("patronymic")} className="input input-bordered w-full" placeholder="Отчество" />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Часовой пояс</span>
                                </label>
                                <div className="flex gap-2">
                                    <select {...register("timezone")} className="input input-bordered flex-1">
                                        {TIMEZONES.map(({ tz, label }) => (
                                            <option key={tz} value={tz}>
                                                {label} {getOffsetLabel(tz) ? `(${getOffsetLabel(tz)})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="min-w-[140px] rounded-md bg-base-200 px-3 py-2 flex flex-col items-start justify-center">
                                        <div className="text-xs text-base-content/60">Текущее время</div>
                                        <div className="font-mono font-semibold">{currentTime}</div>
                                    </div>
                                </div>
                                {errors.timezone && <p className="text-xs text-error mt-1">{errors.timezone.message}</p>}
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button type="submit" disabled={!isDirty || isPending} className="btn btn-primary flex-1 gap-2">
                                    <Save size={16} />
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // сброс до исходных пользовательских данных
                                        reset({
                                            surname: user?.surname ?? "",
                                            name: user?.name ?? "",
                                            patronymic: user?.patronymic ?? "",
                                            timezone: user?.timezone ?? "UTC",
                                        });
                                        setIsEditing(false);
                                    }}
                                    className="btn btn-ghost flex-1"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Доп. блок: подробная регистрационная карточка */}
                <div className="rounded-2xl bg-base-100 shadow-md p-4">
                    <div className="flex items-center gap-4">
                        <Calendar size={20} className="text-primary shrink-0" />
                        <div className="flex-1">
                            <div className="text-sm text-base-content/60">Дата регистрации</div>
                            <div className="font-medium">
                                {user?.createdAt ? formatRegistrationDate(user.createdAt, user?.timezone) : "Не указано"}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-base-content/60">Часовой пояс</div>
                            <div className="font-medium">
                                {displayedTz.label} {displayedTz.offset ? `(${displayedTz.offset})` : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
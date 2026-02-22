'use client';

import {useState, useEffect} from "react";
import {useGetProfile} from "@/api-hooks/user/profile/use-get-profile";
import {useUpdateProfile} from "@/api-hooks/user/profile/use-update-profile";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {User, Calendar, Pencil, X, Save} from "lucide-react";
import {useLaunchParams} from "@tma.js/sdk-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";

const schema = z.object({
    surname: z.string().min(1, "Введите фамилию").max(50),
    name: z.string().min(1, "Введите имя").max(50),
    patronymic: z.string().max(50).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
    const {data: user, isLoading} = useGetProfile();
    const {mutateAsync: updateProfile, isPending} = useUpdateProfile();

    const lp = useLaunchParams(true);
    const photoUrl = lp.tgWebAppData?.user?.photoUrl;

    const [imgError, setImgError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isDirty}
    } = useForm<FormValues>({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        if (user) {
            reset({
                surname: user.surname ?? "",
                name: user.name ?? "",
                patronymic: user.patronymic ?? ""
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

    const formatRegistrationDate = (date: string) => {
        try {
            return format(new Date(date), 'dd.MM.yyyy', {locale: ru});
        } catch {
            return 'Неизвестно';
        }
    };

    const initials = `${user?.surname?.[0] ?? ''}${user?.name?.[0] ?? ''}`;
    const fullName = [user?.surname, user?.name].filter(Boolean).join(' ');

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

            <h1 className="text-center text-2xl font-bold tracking-tight mb-4">
                Профиль
            </h1>

            {/* PROFILE CARD */}
            <div className="relative flex flex-col items-center rounded-2xl bg-base-100 p-6 shadow">

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute right-4 top-4 btn btn-ghost btn-sm btn-circle"
                >
                    {isEditing ? <X size={18}/> : <Pencil size={18}/>}
                </button>

                <div className="relative h-24 w-24">
                    {photoUrl && !imgError ? (
                        <img
                            src={photoUrl}
                            alt="Аватар пользователя"
                            onError={() => setImgError(true)}
                            className="h-24 w-24 rounded-full object-cover shadow-md"
                        />
                    ) : (
                        <div
                            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content shadow-md">
                            {initials || <User size={36}/>}
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <>
                        <div className="mt-4 text-lg font-semibold text-center">
                            {fullName || 'Не указано'}
                        </div>

                        {user?.patronymic && (
                            <div className="text-sm text-base-content/60">
                                {user.patronymic}
                            </div>
                        )}
                    </>
                )}

                {/* EDIT FORM */}
                <div
                    className={`grid transition-all duration-300 w-full ${
                        isEditing ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <div>
                                <input
                                    {...register("surname")}
                                    placeholder="Фамилия"
                                    className="input input-bordered w-full"
                                />
                                {errors.surname &&
                                    <p className="text-xs text-error mt-1">{errors.surname.message}</p>}
                            </div>

                            <div>
                                <input
                                    {...register("name")}
                                    placeholder="Имя"
                                    className="input input-bordered w-full"
                                />
                                {errors.name &&
                                    <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <input
                                    {...register("patronymic")}
                                    placeholder="Отчество (необязательно)"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isDirty || isPending}
                                className="btn btn-primary w-full gap-2"
                            >
                                <Save size={18}/>
                                Сохранить
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* REGISTRATION INFO */}
            <div className="mt-6 rounded-2xl bg-base-100 shadow">
                <div className="flex items-center gap-4 px-4 py-4">
                    <Calendar size={20} className="text-primary shrink-0"/>
                    <div className="flex flex-col">
                        <span className="text-sm text-base-content/60">
                            Дата регистрации
                        </span>
                        <span className="font-medium">
                            {user?.createdAt
                                ? formatRegistrationDate(user.createdAt)
                                : 'Не указано'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
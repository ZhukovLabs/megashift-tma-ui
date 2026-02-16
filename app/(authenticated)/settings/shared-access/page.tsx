"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateInvite } from "@/api-hooks/use-create-invite";
import { shareURL } from "@tma.js/sdk";
import { Share2 } from "lucide-react";

enum AccessClaim {
    READ = "Чтение расписания",
    EDIT_OWNER = "Редактирование чужих смен",
    EDIT_SELF = "Редактирование своих смен",
    DELETE_OWNER = "Удаление чужих смен",
    DELETE_SELF = "Удаление своих смен"
}

type FormValues = {
    accessClaims: (keyof typeof AccessClaim)[];
};

export default function SharedAccessPage() {
    const { mutateAsync: createInvite, isPending } = useCreateInvite();
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            accessClaims: ["READ"]
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);
        try {
            const { id } = await createInvite({ accessClaims: data.accessClaims });
            const url = `https://t.me/megashiftbot?startapp=${id}`;
            shareURL(url, "Приглашаю тебя следить за моими сменами");
        } catch (e) {
            console.error("Invite creation failed", e);
            setError("Не удалось создать ссылку, попробуйте позже");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 via-base-200 to-base-100 px-4 pb-10">
            <h1 className="text-center text-2xl font-bold tracking-tight mb-6">
                Общий доступ
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 rounded-2xl bg-base-100 p-4 shadow space-y-4">
                <Controller
                    name="accessClaims"
                    control={control}
                    rules={{
                        validate: (value) => value.length > 0 || "Должен быть выбран хотя бы один доступ"
                    }}
                    render={({ field }) => (
                        <div>
                            <span className="font-medium text-base-content">Права доступа для приглашённого:</span>
                            <div className="mt-2 flex flex-col gap-2">
                                {Object.entries(AccessClaim).map(([key, label]) => {
                                    const isRead = key === "READ";
                                    return (
                                        <label
                                            key={key}
                                            className="flex items-center gap-2 text-sm cursor-pointer select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                value={key}
                                                checked={field.value.includes(key as keyof typeof AccessClaim)}
                                                disabled={isRead} // READ нельзя убрать
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        field.onChange([...field.value, key as keyof typeof AccessClaim]);
                                                    } else {
                                                        field.onChange(field.value.filter(c => c !== key));
                                                    }
                                                }}
                                                className="checkbox checkbox-primary"
                                            />
                                            {label}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.accessClaims && (
                                <p className="text-xs text-red-500 mt-1">{errors.accessClaims.message}</p>
                            )}
                        </div>
                    )}
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary w-full gap-2"
                >
                    <Share2 size={18} />
                    {isPending ? "Создание ссылки..." : "Поделиться ботом"}
                </button>

                {error && (
                    <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
                )}

                <p className="mt-3 text-xs text-base-content/50 text-center">
                    Отправьте приглашение и позвольте другим следить за вашим расписанием
                </p>
            </form>
        </div>
    );
}

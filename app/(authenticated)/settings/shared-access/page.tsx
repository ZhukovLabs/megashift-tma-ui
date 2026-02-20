"use client";

import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useCreateInvite} from "@/api-hooks/user/invites";
import {shareURL} from "@tma.js/sdk";
import {Share2} from "lucide-react";
import {toast} from 'react-toastify';
import {ACCESS_CLAIM_LABELS} from "@/constants/access-claim-labels";
import {AccessClaim} from "@/constants/access-claim";

type FormValues = {
    claims: (keyof typeof AccessClaim)[];
};

export default function SharedAccessPage() {
    const {mutateAsync: createInvite, isPending} = useCreateInvite();
    const [error, setError] = useState<string | null>(null);

    const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
        defaultValues: {
            claims: [AccessClaim.READ]
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);

        try {
            const {id} = await createInvite({claims: data.claims});
            const url = `https://t.me/megashiftbot?startapp=${id}`;
            shareURL(url, "Приглашаю тебя следить за моими сменами");

            toast.success('Приглашение отправлено!');
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 rounded-2xl bg-base-100 p-6 shadow space-y-4">
                <Controller
                    name="claims"
                    control={control}
                    render={({field}) => (
                        <div>
                            <span
                                className="font-medium text-base-content mb-2 block">Права доступа для приглашённого:</span>
                            <div className="flex flex-col gap-2">
                                {Object.keys(AccessClaim).map((key) => {
                                    const claim = key as keyof typeof AccessClaim;
                                    const label = ACCESS_CLAIM_LABELS[claim];
                                    const isRead = claim === AccessClaim.READ;

                                    return (
                                        <label
                                            key={claim}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                                                       ${field.value.includes(claim) ? "bg-base-200" : "hover:bg-base-150"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                value={claim}
                                                checked={field.value.includes(claim)}
                                                disabled={isRead} // READ нельзя убрать
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        field.onChange([...field.value, claim]);
                                                    } else {
                                                        field.onChange(field.value.filter(c => c !== claim));
                                                    }
                                                }}
                                                className="checkbox checkbox-primary"
                                            />
                                            <span className="text-sm font-medium">{label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.claims && (
                                <p className="text-xs text-red-500 mt-1">{errors.claims.message}</p>
                            )}
                        </div>
                    )}
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary w-full gap-2"
                >
                    <Share2 size={18}/>
                    {isPending ? "Создание ссылки..." : "Поделиться расписанием"}
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

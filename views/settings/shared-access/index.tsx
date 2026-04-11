"use client";

import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useCreateInvite} from "@/features/invite/api";
import {shareURL} from "@tma.js/sdk";
import {Share2, Users, ShieldCheck} from "lucide-react";
import {toast} from 'react-toastify';
import { ACCESS_CLAIM_LABELS, AccessClaim } from '@/entities/access';
import {useAvailableAccess} from "@/features/user/api";
import {AccessTable} from "./access-table";
import {motion} from "framer-motion";

type FormValues = {
    claims: (keyof typeof AccessClaim)[];
};

export function SharedAccessPage() {
    const {mutateAsync: createInvite, isPending} = useCreateInvite();
    const {data: accessUsers = []} = useAvailableAccess();
    const [error, setError] = useState<string | null>(null);

    const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
        defaultValues: {
            claims: [AccessClaim.READ] as (keyof typeof AccessClaim)[]
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
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm text-center">
                <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                    Общий доступ
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/25 mt-1.5 leading-none">
                    Управление правами
                </p>
            </header>

            <main className="w-full px-6 max-w-xl mx-auto pt-8 pb-32 space-y-10">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-base-content/40">Новое приглашение</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200/40 border border-base-200/60 rounded-[32px] p-6 space-y-6">
                        <Controller
                            name="claims"
                            control={control}
                            render={({field}) => (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <ShieldCheck size={14} className="text-primary/40" />
                                        <span className="text-[11px] font-bold text-base-content/60">Выберите уровень доступа:</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.keys(AccessClaim).map((key) => {
                                            const claim = key as keyof typeof AccessClaim;
                                            const label = ACCESS_CLAIM_LABELS[claim];
                                            const isRead = claim === AccessClaim.READ;
                                            const isActive = field.value.includes(claim);

                                            return (
                                                <label
                                                    key={claim}
                                                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                                        isActive 
                                                            ? "bg-base-100 border-primary/20 shadow-sm" 
                                                            : "bg-base-100/40 border-transparent hover:bg-base-100"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            value={claim}
                                                            checked={isActive}
                                                            disabled={isRead}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                if (checked) {
                                                                    field.onChange([...field.value, claim]);
                                                                } else {
                                                                    field.onChange(field.value.filter(c => c !== claim));
                                                                }
                                                            }}
                                                            className="checkbox checkbox-primary checkbox-sm rounded-lg"
                                                        />
                                                        <span className={`text-sm font-bold transition-colors ${
                                                            isActive ? "text-base-content" : "text-base-content/40"
                                                        }`}>{label}</span>
                                                    </div>
                                                    {isRead && <span className="text-[9px] font-black uppercase text-primary/40 bg-primary/5 px-2 py-0.5 rounded-md">Всегда</span>}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn btn-primary w-full h-14 rounded-2xl gap-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                        >
                            <Share2 size={18} strokeWidth={3}/>
                            {isPending ? "Создание..." : "Пригласить"}
                        </button>

                        {error && (
                            <p className="text-center text-error text-[10px] font-bold uppercase tracking-tight">{error}</p>
                        )}
                    </form>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AccessTable users={accessUsers}/>
                </motion.div>
            </main>
        </div>
    );
}

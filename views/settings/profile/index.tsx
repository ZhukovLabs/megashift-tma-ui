'use client';

import {useEffect, useMemo, useState} from 'react';
import {useGetProfile, useUpdateProfile} from '@/features/user/api';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {Pencil, X, Save, Globe, Clock, CalendarDays, Camera, ShieldCheck} from 'lucide-react';
import {useLaunchParams} from '@tma.js/sdk-react';
import {useForm, useWatch} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';
import cn from 'classnames';

const schema = z.object({
    surname: z.string().min(1, 'Фамилия обязательна').max(50),
    name: z.string().min(1, 'Имя обязательно').max(50),
    patronymic: z.string().max(50).optional().or(z.literal('')),
    timezone: z.string().min(1, 'Выберите часовой пояс'),
});

type FormValues = z.infer<typeof schema>;

const TIMEZONES = [
    {label: 'Минск', tz: 'Europe/Minsk'},
    {label: 'Москва', tz: 'Europe/Moscow'},
    {label: 'Киев', tz: 'Europe/Kyiv'},
    {label: 'Лондон', tz: 'Europe/London'},
    {label: 'Париж', tz: 'Europe/Paris'},
    {label: 'Нью-Йорк', tz: 'America/New_York'},
    {label: 'Лос-Анджелес', tz: 'America/Los_Angeles'},
    {label: 'Токио', tz: 'Asia/Tokyo'},
    {label: 'UTC', tz: 'UTC'},
];

function getOffset(tz: string) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'short',
        }).formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    } catch {
        return '';
    }
}

function getTimeInZone(tz: string) {
    try {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: tz,
        }).format(new Date());
    } catch {
        return '--:--';
    }
}

function formatRegDate(dateStr: string, tz?: string) {
    try {
        const d = new Date(dateStr);
        if (!tz) return format(d, 'dd.MM.yyyy', {locale: ru});

        const date = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: tz,
        }).format(d);

        const time = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: tz,
            hour12: false,
        }).format(d);

        return `${date} в ${time}`;
    } catch {
        return '—';
    }
}

export function ProfileSettingsPage() {
    const {data: user, isLoading} = useGetProfile();
    const {mutateAsync: update, isPending} = useUpdateProfile();
    const t = useTranslations('profile');

    const lp = useLaunchParams(true);
    const photo = lp.tgWebAppData?.user?.photoUrl;

    const [imgError, setImgError] = useState(false);
    const [editing, setEditing] = useState(false);

    const {register, handleSubmit, reset, formState: {errors, isDirty}, control} =
        useForm<FormValues>({
            resolver: zodResolver(schema),
            defaultValues: {surname: '', name: '', patronymic: '', timezone: 'UTC'},
        });

    const watchedTz = useWatch({control, name: 'timezone'});

    const [now, setNow] = useState(getTimeInZone(user?.timezone ?? 'UTC'));

    useEffect(() => {
        const tz = editing ? watchedTz || user?.timezone || 'UTC' : user?.timezone || 'UTC';
        setNow(getTimeInZone(tz));

        const id = setInterval(() => setNow(getTimeInZone(tz)), 1000);
        return () => clearInterval(id);
    }, [editing, watchedTz, user?.timezone]);

    useEffect(() => {
        if (user) {
            reset({
                surname: user.surname ?? '',
                name: user.name ?? '',
                patronymic: user.patronymic ?? '',
                timezone: user.timezone ?? 'UTC',
            });
        }
    }, [user, reset]);

    const onSubmit = async (values: FormValues) => {
        try {
            await update(values);
            toast.success('Профиль обновлен');
            setEditing(false);
        } catch {
            toast.error('Ошибка сохранения');
        }
    };

    const initials = `${user?.surname?.[0] ?? ''}${user?.name?.[0] ?? ''}`.toUpperCase() || '??';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full min-h-full">
                <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm">
                    <div className="h-8 w-32 bg-base-200 rounded-full mx-auto animate-pulse" />
                </header>
                <div className="px-6 py-8 w-full max-w-xl mx-auto space-y-4">
                    <div className="skeleton h-40 w-full rounded-[32px]"/>
                    <div className="skeleton h-20 w-full rounded-[32px]"/>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-full bg-base-100">
            <header className="w-full pt-2 pb-4 px-6 sticky top-0 z-30 bg-base-100 border-b border-base-200/60 shadow-sm">
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center">
                    <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                        Профиль
                    </h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/25 mt-1.5 leading-none">
                        Личные настройки
                    </p>
                </div>
            </header>

            <main className="w-full px-6 max-w-xl mx-auto pt-8 pb-32 space-y-6">
                {/* Карточка профиля */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-base-200/40 border border-base-200/60 rounded-[40px] p-6 relative overflow-hidden"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className="w-24 h-24 rounded-[32px] border-4 border-base-100 shadow-xl overflow-hidden relative z-10 bg-base-100">
                                {photo && !imgError ? (
                                    <img src={photo} alt="" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-3xl font-black uppercase">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-base-100 shadow-lg flex items-center justify-center z-20 text-primary">
                                <ShieldCheck size={20} strokeWidth={2.5} />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-base-content tracking-tight">
                            {user?.surname} {user?.name}
                        </h2>
                        {user?.patronymic && (
                            <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest mt-1">
                                {user.patronymic}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-6 w-full">
                            <div className="flex-1 bg-base-100/60 rounded-2xl p-3 border border-base-200/50 flex flex-col items-center">
                                <Clock size={14} className="text-primary/40 mb-1" />
                                <span className="text-sm font-black text-base-content/80">{now}</span>
                                <span className="text-[8px] font-black uppercase text-base-content/20 tracking-tighter">Местное время</span>
                            </div>
                            <div className="flex-1 bg-base-100/60 rounded-2xl p-3 border border-base-200/50 flex flex-col items-center">
                                <Globe size={14} className="text-primary/40 mb-1" />
                                <span className="text-sm font-black text-base-content/80 truncate w-full text-center">
                                    {TIMEZONES.find(t => t.tz === (watchedTz || user?.timezone))?.label ?? 'UTC'}
                                </span>
                                <span className="text-[8px] font-black uppercase text-base-content/20 tracking-tighter">Часовой пояс</span>
                            </div>
                        </div>

                        {!editing && (
                            <button 
                                onClick={() => setEditing(true)}
                                className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                            >
                                <Pencil size={12} strokeWidth={3} />
                                Редактировать
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {editing && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-8 pt-6 border-t border-base-200/60"
                            >
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Фамилия</label>
                                            <input
                                                {...register('surname')}
                                                className="w-full h-12 px-4 rounded-xl bg-base-100 border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm outline-none shadow-sm"
                                                placeholder="Введите фамилию"
                                            />
                                            {errors.surname && <p className="text-error text-[10px] font-bold ml-2">{errors.surname.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Имя</label>
                                            <input
                                                {...register('name')}
                                                className="w-full h-12 px-4 rounded-xl bg-base-100 border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm outline-none shadow-sm"
                                                placeholder="Введите имя"
                                            />
                                            {errors.name && <p className="text-error text-[10px] font-bold ml-2">{errors.name.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Отчество</label>
                                            <input
                                                {...register('patronymic')}
                                                className="w-full h-12 px-4 rounded-xl bg-base-100 border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm outline-none shadow-sm"
                                                placeholder="Необязательно"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 ml-2 block">Часовой пояс</label>
                                            <select
                                                {...register('timezone')}
                                                className="w-full h-12 px-4 rounded-xl bg-base-100 border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm outline-none shadow-sm appearance-none cursor-pointer"
                                            >
                                                {TIMEZONES.map(({tz, label}) => (
                                                    <option key={tz} value={tz}>
                                                        {label} ({getOffset(tz)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={!isDirty || isPending}
                                            className="h-12 flex-1 rounded-xl bg-primary text-primary-content font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            <Save size={14} className="inline mr-2" /> Сохранить
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => { reset(); setEditing(false); }}
                                            className="h-12 flex-1 rounded-xl bg-base-200 text-base-content/60 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Инфо-карточка регистрации */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-base-100 rounded-[32px] p-5 border border-base-200 flex items-center gap-4 shadow-sm"
                >
                    <div className="w-12 h-12 rounded-[18px] bg-primary/5 flex items-center justify-center text-primary">
                        <CalendarDays size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/20 leading-none">Дата регистрации</span>
                        <span className="text-sm font-bold text-base-content/80 mt-1.5 uppercase">
                            {user?.createdAt ? formatRegDate(user.createdAt, user.timezone) : '—'}
                        </span>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

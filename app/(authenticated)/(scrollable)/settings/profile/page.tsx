'use client';

import {useEffect, useMemo, useState} from 'react';
import {useGetProfile} from '@/api-hooks/user/profile/use-get-profile';
import {useUpdateProfile} from '@/api-hooks/user/profile/use-update-profile';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {Pencil, X, Save, Globe, Clock, CalendarDays} from 'lucide-react';
import {useLaunchParams} from '@tma.js/sdk-react';
import {useForm, useWatch} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';

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

        const offset = getOffset(tz);
        return `${date} • ${time} ${offset ? `(${offset})` : ''}`;
    } catch {
        return '—';
    }
}

export default function ProfilePage() {
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
            toast.success('Сохранено');
            setEditing(false);
        } catch {
            toast.error('Ошибка сохранения');
        }
    };

    const initials = `${user?.surname?.[0] ?? ''}${user?.name?.[0] ?? ''}`.toUpperCase() || '??';

    const displayedTz = useMemo(() => {
        const tz = editing ? watchedTz ?? user?.timezone : user?.timezone;
        const item = TIMEZONES.find(t => t.tz === tz);
        return {
            label: item?.label ?? tz ?? 'UTC',
            offset: tz ? getOffset(tz) : '',
        };
    }, [editing, watchedTz, user?.timezone]);

    if (isLoading) {
        return (
            <div className="px-4 py-8 space-y-5">
                <div className="skeleton h-36 w-full rounded-2xl"/>
                <div className="skeleton h-28 w-full rounded-2xl"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-center pt-6 pb-5">{t('title')}</h1>

            <div className="space-y-5 max-w-lg mx-auto">
                <div className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden relative">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"/>

                    <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="avatar">
                                <div
                                    className="w-20 h-20 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                                    {photo && !imgError ? (
                                        <img src={photo} alt="" onError={() => setImgError(true)}
                                             className="object-cover"/>
                                    ) : (
                                        <div
                                            className="bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="text-xl font-semibold truncate">
                                        {user?.surname} {user?.name}
                                    </h2>

                                    <button
                                        onClick={() => setEditing(!editing)}
                                        className="btn btn-ghost btn-sm btn-circle"
                                    >
                                        {editing ? <X size={18}/> : <Pencil size={18}/>}
                                    </button>
                                </div>

                                {user?.patronymic && (
                                    <p className="text-sm text-base-content/60 mt-0.5">{user.patronymic}</p>
                                )}

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 opacity-80">
                                        <CalendarDays size={16}/>
                                        <span className="font-mono">{now}</span>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-80">
                                        <Globe size={16}/>
                                        <span>
                      {displayedTz.label}
                                            {displayedTz.offset &&
                                                <span className="text-xs opacity-70 ml-1">({displayedTz.offset})</span>}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Форма редактирования */}
                        <div
                            className={`mt-6 space-y-4 transition-all duration-300 origin-top ${
                                editing ? 'scale-y-100 opacity-100 max-h-[500px]' : 'scale-y-0 opacity-0 max-h-0 overflow-hidden'
                            }`}
                        >
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            {...register('surname')}
                                            placeholder="Фамилия"
                                            className="input input-bordered w-full"
                                        />
                                        {errors.surname &&
                                            <p className="text-error text-xs mt-1.5">{errors.surname.message}</p>}
                                    </div>

                                    <div>
                                        <input
                                            {...register('name')}
                                            placeholder="Имя"
                                            className="input input-bordered w-full"
                                        />
                                        {errors.name &&
                                            <p className="text-error text-xs mt-1.5">{errors.name.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        {...register('patronymic')}
                                        placeholder="Отчество (необязательно)"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <select {...register('timezone')} className="select select-bordered w-full">
                                        {TIMEZONES.map(({tz, label}) => (
                                            <option key={tz} value={tz}>
                                                {label} {getOffset(tz) ? `(${getOffset(tz)})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.timezone &&
                                        <p className="text-error text-xs mt-1.5">{errors.timezone.message}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={!isDirty || isPending}
                                        className="btn btn-primary flex-1 gap-2"
                                    >
                                        <Save size={16}/>
                                        Сохранить
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditing(false);
                                        }}
                                        className="btn btn-outline flex-1"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100/60 backdrop-blur-sm shadow-sm rounded-2xl p-4 text-sm">
                    <div className="flex items-center gap-3 opacity-85">
                        <CalendarDays size={18} className="text-primary"/>
                        <div className="flex-1">
                            <div className="text-base-content/60 text-xs">{t('registered')}</div>
                            <div className="font-medium">
                                {user?.createdAt ? formatRegDate(user.createdAt, user.timezone) : '—'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
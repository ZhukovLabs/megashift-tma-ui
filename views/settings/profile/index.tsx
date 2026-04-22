'use client';

import {useEffect, useMemo, useState} from 'react';
import {useGetProfile, useUpdateProfile} from '@/features/user/api';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {Pencil, X, Save, Globe, Clock, CalendarDays} from 'lucide-react';
import {useLaunchParams} from '@tma.js/sdk-react';
import {useForm, useWatch} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';

export function ProfileSettingsPage() {
    const t = useTranslations();
    const {data: user, isLoading} = useGetProfile();
    const {mutateAsync: update, isPending} = useUpdateProfile();

    const schema = useMemo(() => z.object({
        surname: z.string().min(1, t('profile.surname.required')).max(50),
        name: z.string().min(1, t('profile.name.required')).max(50),
        patronymic: z.string().max(50).optional().or(z.literal('')),
        timezone: z.string().min(1, t('profile.timezone.required')),
    }), [t]);

    const TIMEZONES = useMemo(() => [
        {label: 'UTC', tz: 'UTC'},
        {label: t('timezones.minsk', {defaultValue: 'Минск'}), tz: 'Europe/Minsk'},
        {label: t('timezones.moscow', {defaultValue: 'Москва'}), tz: 'Europe/Moscow'},
        {label: t('timezones.kyiv', {defaultValue: 'Киев'}), tz: 'Europe/Kyiv'},
        {label: t('timezones.london', {defaultValue: 'Лондон'}), tz: 'Europe/London'},
        {label: t('timezones.paris', {defaultValue: 'Париж'}), tz: 'Europe/Paris'},
        {label: t('timezones.newYork', {defaultValue: 'Нью-Йорк'}), tz: 'America/New_York'},
        {label: t('timezones.losAngeles', {defaultValue: 'Лос-Анджелес'}), tz: 'America/Los_Angeles'},
        {label: t('timezones.tokyo', {defaultValue: 'Токио'}), tz: 'Asia/Tokyo'},
    ], [t]);

    type FormValues = z.infer<typeof schema>;

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

    const [now, setNow] = useState(getTimeInZone(user?.timezone ?? 'UTC', t));

    useEffect(() => {
        const tz = editing ? watchedTz || user?.timezone || 'UTC' : user?.timezone || 'UTC';
        setNow(getTimeInZone(tz, t));

        const id = setInterval(() => setNow(getTimeInZone(tz, t)), 1000);
        return () => clearInterval(id);
    }, [editing, watchedTz, user?.timezone, t]);

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
            toast.success(t('profile.saveSuccess'));
            setEditing(false);
        } catch {
            toast.error(t('profile.saveError'));
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
    }, [editing, watchedTz, user?.timezone, TIMEZONES]);

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
            <h1 className="text-2xl font-bold text-center pt-6 pb-5">{t('profile.title')}</h1>

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
                                        <Clock size={16}/>
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
                                            placeholder={t('profile.surname.placeholder')}
                                            className="input input-bordered w-full"
                                        />
                                        {errors.surname &&
                                            <p className="text-error text-xs mt-1.5">{errors.surname.message}</p>}
                                    </div>

                                    <div>
                                        <input
                                            {...register('name')}
                                            placeholder={t('profile.name.placeholder')}
                                            className="input input-bordered w-full"
                                        />
                                        {errors.name &&
                                            <p className="text-error text-xs mt-1.5">{errors.name.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        {...register('patronymic')}
                                        placeholder={t('profile.patronymic.placeholder')}
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
                                        {t('common.save')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditing(false);
                                        }}
                                        className="btn btn-outline flex-1"
                                    >
                                        {t('common.cancel')}
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
                            <div className="text-base-content/60 text-xs">{t('profile.registered')}</div>
                            <div className="font-medium">
                                {user?.createdAt ? formatRegDate(user.createdAt, user.timezone, t) : '—'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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

function getTimeInZone(tz: string, t: ReturnType<typeof useTranslations>) {
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

function formatRegDate(dateStr: string, tz: string | undefined, t: ReturnType<typeof useTranslations>) {
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

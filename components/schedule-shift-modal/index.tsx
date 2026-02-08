'use client';

import {useCallback, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {format, parseISO, differenceInMinutes, addDays} from 'date-fns';
import {ru} from 'date-fns/locale';
import {Trash2} from 'lucide-react';
import {formatInTimeZone, fromZonedTime} from 'date-fns-tz';

import {useGetShiftsByDate} from '@/api-hooks/use-get-shifts-by-date';
import {useGetShiftTemplates} from '@/api-hooks/use-get-shift-templates';
import {useUserStore} from '@/store/user-store';
import {useDeleteShift} from '@/api-hooks/use-delete-shift';
import {popup} from '@tma.js/sdk';

type ShiftTemplate = {
    id: string;
    label?: string;
    startTime?: string;
    endTime?: string;
};

type Shift = {
    id: string;
    shiftTemplateId?: string;
    actualStartTime?: string;
    actualEndTime?: string;
};

export const ShiftModal = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedDayStr = searchParams.get('date') ?? '';
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');

    const isOpen = Boolean(selectedDayStr);

    const {data: shiftTemplates = []} = useGetShiftTemplates() || {data: []};
    const {data: dayShifts = []} = useGetShiftsByDate({date: selectedDayStr}) || {data: []};
    const {mutateAsync: deleteShift} = useDeleteShift();

    const onClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('date');
        router.replace(pathname + (params.toString() ? `?${params.toString()}` : ''));
    }, [router, searchParams, pathname]);

    const enhancedShifts = useMemo(
        () =>
            dayShifts.map(shift => {
                const normalizedShift = {
                    ...shift,
                    shiftTemplateId: shift.shiftTemplateId ?? undefined,
                } as Shift;
                const template = shiftTemplates.find(t => t.id === normalizedShift.shiftTemplateId);
                return {shift: normalizedShift, template};
            }),
        [dayShifts, shiftTemplates]
    );

    const isTimeOnly = (s?: string) =>
        Boolean(s && /^\d{1,2}:\d{2}(:\d{2})?$/.test(s));

    const resolveToUtcDate = useCallback(
        (time?: string) => {
            if (!time) return null;

            try {
                if (isTimeOnly(time)) {
                    if (!selectedDayStr) return null;
                    const timePart = time.length === 5 ? `${time}:00` : time;
                    return fromZonedTime(`${selectedDayStr}T${timePart}`, tz);
                }

                if (/[Z+-]/.test(time)) {
                    return parseISO(time);
                }

                return fromZonedTime(time, tz);
            } catch {
                return null;
            }
        },
        [selectedDayStr, tz]
    );

    const formatTime = useCallback(
        (time?: string) => {
            if (!time) return '--:--';

            try {
                if (isTimeOnly(time)) {
                    if (!selectedDayStr) return time;
                    const timePart = time.length === 5 ? `${time}:00` : time;
                    return formatInTimeZone(`${selectedDayStr}T${timePart}`, tz, 'HH:mm');
                }

                return formatInTimeZone(time, tz, 'HH:mm');
            } catch {
                return '--:--';
            }
        },
        [selectedDayStr, tz]
    );

    const getDuration = useCallback(
        (start?: string, end?: string) => {
            const startUtc = resolveToUtcDate(start);
            const endUtcRaw = resolveToUtcDate(end);

            if (!startUtc || !endUtcRaw) return null;

            let endUtc = endUtcRaw;
            if (endUtc <= startUtc) {
                endUtc = addDays(endUtc, 1);
            }

            const minutes = differenceInMinutes(endUtc, startUtc);
            if (minutes <= 0) return null;

            const h = Math.floor(minutes / 60);
            const m = minutes % 60;

            return `${h}ч ${m.toString().padStart(2, '0')}м`;
        },
        [resolveToUtcDate]
    );

    const handleDelete = (shiftId: string) => async () => {
        const confirmed = await popup.show({
            title: 'Удалить смену?',
            message: 'Это действие нельзя отменить',
            buttons: [
                {id: 'yes', type: 'destructive', text: 'Удалить'},
                {id: 'no', type: 'cancel'},
            ],
        });

        if (confirmed === 'yes') {
            await deleteShift(shiftId);
        }
    };

    const renderShift = ({shift, template}: { shift: Shift; template?: ShiftTemplate }) => {
        const start = shift.actualStartTime ?? template?.startTime;
        const end = shift.actualEndTime ?? template?.endTime;
        const duration = getDuration(start, end);

        return (
            <div
                key={shift.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-base-100"
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold">
                            {formatTime(start)}
                        </span>
                        <span className="text-sm opacity-60">
                            — {formatTime(end)}
                        </span>
                    </div>

                    <div className="text-sm font-medium">
                        {template?.label ?? 'Смена без названия'}
                    </div>

                    {duration && (
                        <div className="text-xs opacity-60">
                            {duration}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleDelete(shift.id)}
                    className="p-3"
                    aria-label="Удалить смену"
                >
                    <Trash2 className="w-5 h-5 text-red-500"/>
                </button>
            </div>
        );
    };

    const selectedDayDate = selectedDayStr ? parseISO(selectedDayStr) : null;

    if (!isOpen) return null;

    return (
        <>
            {/* BACKDROP */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            {/* DESKTOP MODAL */}
            <div className="hidden sm:flex fixed inset-0 z-50 items-center justify-center">
                <div className="bg-base-100 rounded-2xl w-full max-w-lg p-4">
                    <Header date={selectedDayDate} onClose={onClose} />
                    <Content shifts={enhancedShifts} renderShift={renderShift} />
                    <Footer onClose={onClose} />
                </div>
            </div>

            {/* MOBILE BOTTOM SHEET */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-base-100 rounded-t-2xl p-4 max-h-[85vh] flex flex-col">
                    <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-base-300" />
                    <Header date={selectedDayDate} onClose={onClose} />
                    <Content shifts={enhancedShifts} renderShift={renderShift} />
                    <Footer onClose={onClose} />
                </div>
            </div>
        </>
    );
};

/* ====== helpers ====== */

const Header = ({date, onClose}: { date: Date | null; onClose: () => void }) => (
    <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
            {date && format(date, 'd MMMM', {locale: ru})}
        </h3>
        <button onClick={onClose} className="text-lg">✕</button>
    </div>
);

const Content = ({shifts, renderShift}: any) => (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {shifts.length === 0 ? (
            <p className="text-center opacity-60 py-8">
                На этот день нет смен
            </p>
        ) : (
            shifts.map(renderShift)
        )}
    </div>
);

const Footer = ({onClose}: { onClose: () => void }) => (
    <div className="pt-3">
        <button className="btn btn-primary w-full" onClick={onClose}>
            Закрыть
        </button>
    </div>
);

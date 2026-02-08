'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

import { useGetShiftsByDate } from '@/api-hooks/use-get-shifts-by-date';
import { useGetShiftTemplates } from '@/api-hooks/use-get-shift-templates';
import { useUserStore } from '@/store/user-store';

type ShiftTemplate = {
    id: string;
    label?: string;
    startTime?: string;
    endTime?: string;
};

type Shift = {
    id: string;
    shiftTemplateId?: string; // нормализуем null к undefined
    actualStartTime?: string;
    actualEndTime?: string;
};

export const ShiftModal = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedDay = searchParams.get('date');
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');

    const isOpen = Boolean(selectedDay);

    const { data: shiftTemplates = [] } = useGetShiftTemplates() || { data: [] };
    const { data: dayShifts = [] } = useGetShiftsByDate({ date: selectedDay || '' }) || { data: [] };

    const onClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('date');
        router.replace(pathname + (params.toString() ? `?${params.toString()}` : ''));
    }, [router, searchParams, pathname]);

    // Нормализуем shiftTemplateId: null -> undefined
    const enhancedShifts = useMemo(
        () =>
            dayShifts.map(shift => {
                const normalizedShift = {
                    ...shift,
                    shiftTemplateId: shift.shiftTemplateId ?? undefined,
                } as Shift;
                const template = shiftTemplates.find(t => t.id === normalizedShift.shiftTemplateId);
                return { shift: normalizedShift, template };
            }),
        [dayShifts, shiftTemplates]
    );

    const formatTime = useCallback(
        (time: string | undefined) => (time ? formatInTimeZone(time, tz, 'HH:mm') : '--:--'),
        [tz]
    );

    const renderShift = ({ shift, template }: { shift: Shift; template?: ShiftTemplate }) => (
        <div
            key={shift.id}
            className="flex items-center justify-between p-3 sm:p-4 bg-base-100 rounded-xl shadow hover:shadow-md transition cursor-default"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-sm sm:text-base">{template?.label ?? 'Смена без названия'}</span>
                <span className="text-xs sm:text-sm text-gray-500">
          {formatTime(shift.actualStartTime ?? template?.startTime)} — {formatTime(shift.actualEndTime ?? template?.endTime)}
        </span>
            </div>

            <button
                aria-label="Удалить смену"
                className="p-1 rounded-full hover:bg-red-100 transition"
                onClick={() => {
                    // TODO: Добавить удаление через useDeleteShift или другой мутационный хук
                }}
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );

    return (
        <>
            <input type="checkbox" id="shift-modal" className="modal-toggle" checked={isOpen} readOnly />

            <div
                className={`modal modal-bottom sm:modal-middle ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
            >
                <div
                    className={`modal-box max-w-md sm:max-w-lg bg-base-200 rounded-2xl shadow-2xl border border-base-300 p-4 sm:p-6 transform transition-all duration-300 ${
                        isOpen ? 'scale-100' : 'scale-95'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-primary">
                            Смены на {selectedDay ? format(new Date(selectedDay), 'd MMMM yyyy', { locale: ru }) : ''}
                        </h3>
                        <button
                            aria-label="Закрыть модалку"
                            className="btn btn-circle btn-ghost btn-sm text-lg hover:bg-base-300 transition"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="divider my-2" />

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {enhancedShifts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-70">
                                <p className="text-base sm:text-lg font-medium">На этот день пока нет смен</p>
                            </div>
                        ) : (
                            enhancedShifts.map(renderShift)
                        )}
                    </div>

                    <div className="modal-action mt-4 justify-center">
                        <button
                            className="btn btn-primary btn-wide rounded-full normal-case text-base sm:text-lg transition hover:scale-105"
                            onClick={onClose}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

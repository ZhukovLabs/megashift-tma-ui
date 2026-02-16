'use client';

import {useCallback, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';
import {popup} from '@tma.js/sdk';

import {useGetShiftsByDate} from '@/api-hooks/shifts/use-get-shifts-by-date';
import {useGetShiftTemplates} from '@/api-hooks/shift-templates/use-get-shift-templates';
import {useUserStore} from '@/store/user-store';
import {useDeleteShift} from '@/api-hooks/shifts/use-delete-shift';
import {useUpdateShift} from '@/api-hooks/shifts/use-update-shift';
import {ModalSheet} from '@/components/modal-sheet';
import {ShiftRow} from './shift-row';
import * as timeUtils from '@/utils/time';
import {LoaderLarge} from "@/components/loader-large";

export const ShiftModal = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedDayStr = searchParams.get('date') ?? '';
    const tz = useUserStore(s => s.user?.timezone ?? 'UTC');
    const isOpen = Boolean(selectedDayStr);

    const {
        data: shiftTemplates = [],
        isFetching: isTemplatesFetching,
    } = useGetShiftTemplates();

    const {
        data: dayShifts = [],
        isFetching: isShiftsFetching,
    } = useGetShiftsByDate({date: selectedDayStr});

    const isAnyFetching = Boolean(isTemplatesFetching || isShiftsFetching);

    const {mutateAsync: deleteShift} = useDeleteShift();
    const {mutateAsync: updateShift} = useUpdateShift();

    const onClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('date');
        router.replace(pathname + (params.toString() ? `?${params.toString()}` : ''));
    }, [router, searchParams, pathname]);

    const enhancedShifts = useMemo(() =>
        (dayShifts || []).map(shift => ({
            shift,
            template: (shiftTemplates || []).find(t => t.id === shift.shiftTemplateId)
        })), [dayShifts, shiftTemplates]
    );

    const handleDelete = (shiftId: string) => async () => {
        const confirmed = await popup.show({
            title: 'Удалить смену?',
            message: 'Это действие нельзя отменить',
            buttons: [{id: 'yes', type: 'destructive', text: 'Удалить'}, {id: 'no', type: 'cancel'}]
        });
        if (confirmed !== 'yes' || !selectedDayStr) return;

        const date = parseISO(selectedDayStr);
        await deleteShift({id: shiftId, year: date.getFullYear(), month: date.getMonth() + 1});
    };

    const selectedDayDate = selectedDayStr ? parseISO(selectedDayStr) : null;

    return (
        <ModalSheet
            isOpen={isOpen}
            onClose={onClose}
            title={
                selectedDayDate && (
                    <div className="flex items-center">
                        <span>{format(selectedDayDate, 'd MMMM', {locale: ru})}</span>
                    </div>
                )
            }
            footer={<button className="btn btn-primary w-full" onClick={onClose}>Закрыть</button>}
        >
            <div className="flex flex-col gap-2">
                {isAnyFetching ? (
                    <LoaderLarge/>
                ) : (
                    <>
                        {enhancedShifts.length === 0 ? (
                            <p className="text-center opacity-60 py-8">На этот день нет смен</p>
                        ) : (
                            enhancedShifts.map(({shift, template}) => (
                                <ShiftRow
                                    key={shift.id}
                                    shift={{
                                        ...shift,
                                        actualStartTime: shift.actualStartTime ?? undefined,
                                        actualEndTime: shift.actualEndTime ?? undefined,
                                        shiftTemplateId: shift.shiftTemplateId ?? undefined
                                    }}
                                    template={template}
                                    updateShift={async (data) => {
                                        await updateShift(data);
                                    }}
                                    getDuration={(s, e) => timeUtils.getDuration(s, e, selectedDayStr, tz)}
                                    handleDelete={handleDelete}
                                    formatTime={(t) => timeUtils.formatTime(t, selectedDayStr, tz)}
                                />
                            ))
                        )}
                    </>
                )}
            </div>
        </ModalSheet>
    );
};

'use client';

import {useCallback, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';
import {popup} from '@tma.js/sdk';

import {useGetShiftsByDate, useUpdateShift, useDeleteShift} from '@/features/shift/api';
import {useGetShiftTemplates} from '@/features/shift-template/api';
import {useUserStore} from '@/entities/user';
import {ModalSheet} from '@/shared/ui/modal-sheet';
import {ShiftRow} from './shift-row';
import * as timeUtils from '@/shared/lib/time';
import {LoaderLarge} from "@/shared/ui/loader-large";
import {useTranslations} from 'next-intl';

export const ShiftModal = () => {
    const t = useTranslations();
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
            title: t('schedule.deleteShift.title'),
            message: t('schedule.deleteShift.message'),
            buttons: [{id: 'yes', type: 'destructive', text: t('schedule.deleteShift.confirm')}, {id: 'no', type: 'cancel'}]
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
            footer={<button className="btn btn-primary w-full" onClick={onClose}>{t('common.close')}</button>}
        >
            <div className="flex flex-col gap-2">
                {isAnyFetching ? (
                    <LoaderLarge />
                ) : (
                    <>
                        {enhancedShifts.length === 0 ? (
                            <p className="text-center opacity-60 py-8">{t('schedule.noShifts')}</p>
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

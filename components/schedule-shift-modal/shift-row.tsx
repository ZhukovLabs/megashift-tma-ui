'use client';

import {useState} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {Trash2, Edit2, Check, X} from 'lucide-react';

import type {UpdateShiftPayload} from '@/api-hooks/shifts/use-update-shift';

type ShiftRowProps = {
    shift: { id: string; actualStartTime?: string; actualEndTime?: string; shiftTemplateId?: string };
    template?: { label?: string; startTime?: string; endTime?: string };
    updateShift: (data: UpdateShiftPayload) => Promise<void>;
    getDuration: (start?: string, end?: string) => string | null;
    handleDelete: (id: string) => () => void;
    formatTime: (time?: string) => string;
};

export const ShiftRow = ({shift, template, updateShift, getDuration, handleDelete, formatTime}: ShiftRowProps) => {
    const [editing, setEditing] = useState(false);

    const {control, handleSubmit, reset} = useForm<UpdateShiftPayload>({
        defaultValues: {
            actualStartTime: shift.actualStartTime ?? template?.startTime ?? '',
            actualEndTime: shift.actualEndTime ?? template?.endTime ?? '',
        },
    });

    const [start, end] = useWatch({control, name: ['actualStartTime', 'actualEndTime']});
    const duration = getDuration(start ?? undefined, end ?? undefined);

    const onSubmit = async (data: UpdateShiftPayload) => {
        await updateShift({...data, id: shift.id});
        setEditing(false);
    };

    const onCancel = () => {
        reset({
            actualStartTime: formatTime(shift.actualStartTime ?? template?.startTime),
            actualEndTime: formatTime(shift.actualEndTime ?? template?.endTime),
        });
        setEditing(false);
    };

    const enterEditMode = () => {
        reset({
            actualStartTime: formatTime(shift.actualStartTime ?? template?.startTime),
            actualEndTime: formatTime(shift.actualEndTime ?? template?.endTime),
        });
        setEditing(true);
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-base-100 gap-4">
            <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                    {editing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
                            <Controller
                                name="actualStartTime"
                                control={control}
                                render={({field}) => (
                                    <input
                                        type="time"
                                        className="input input-bordered input-sm w-20"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <span className="opacity-60">—</span>
                            <Controller
                                name="actualEndTime"
                                control={control}
                                render={({field}) => (
                                    <input
                                        type="time"
                                        className="input input-bordered input-sm w-20"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />

                            {duration && <span className="text-xs opacity-60 ml-2">{duration}</span>}
                            <button type="submit" className="p-2"><Check className="w-4 h-4 text-green-500"/></button>
                            <button type="button" className="p-2" onClick={onCancel}><X
                                className="w-4 h-4 text-red-500"/></button>
                        </form>
                    ) : (
                        <>
                            <span
                                className="text-xl font-semibold">{formatTime(shift.actualStartTime ?? template?.startTime)}</span>
                            <span
                                className="text-sm opacity-60">— {formatTime(shift.actualEndTime ?? template?.endTime)}</span>
                            {duration && <span className="text-xs opacity-60 ml-2">{duration}</span>}
                            <button type="button" className="p-2 ml-2" onClick={enterEditMode}><Edit2
                                className="w-4 h-4 text-blue-500"/></button>
                        </>
                    )}
                </div>
                <div className="text-sm font-medium">{template?.label ?? 'Смена без названия'}</div>
            </div>
            <button type="button" onClick={handleDelete(shift.id)} className="p-3" aria-label="Удалить смену">
                <Trash2 className="w-5 h-5 text-red-500"/>
            </button>
        </div>
    );
};

'use client';

import {useState} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {Trash2, Edit2, Check, X, Clock} from 'lucide-react';
import cn from 'classnames';
import {useTranslations} from 'next-intl';

import type {UpdateShiftPayload} from '@/features/shift/api';

type ShiftRowProps = {
    shift: { id: string; actualStartTime?: string; actualEndTime?: string; shiftTemplateId?: string };
    template?: { label?: string; startTime?: string; endTime?: string; color?: string };
    updateShift: (data: UpdateShiftPayload) => Promise<void>;
    getDuration: (start?: string, end?: string) => string | null;
    handleDelete: (id: string) => () => void;
    formatTime: (time?: string) => string;
};

export const ShiftRow = ({shift, template, updateShift, getDuration, handleDelete, formatTime}: ShiftRowProps) => {
    const t = useTranslations();
    const [editing, setEditing] = useState(false);
    const color = template?.color ?? '#3b82f6';

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
        <div className="flex flex-col p-4 rounded-[24px] bg-base-200/40 border border-base-200/50 mb-3 last:mb-0 transition-all active:scale-[0.99]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{backgroundColor: `${color}15`, color: color}}
                    >
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: color}} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black text-base-content/90 tracking-tight leading-none">
                            {template?.label ?? t('shifts.unnamedShift')}
                        </span>
                        <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest mt-1">
                            {t('shifts.templateLabel')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {!editing && (
                        <button 
                            type="button" 
                            onClick={enterEditMode}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary/40 active:bg-primary active:text-white transition-all"
                        >
                            <Edit2 size={18} strokeWidth={2.5}/>
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={handleDelete(shift.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-error/5 text-error/30 active:bg-error active:text-white transition-all"
                    >
                        <Trash2 size={18} strokeWidth={2.5}/>
                    </button>
                </div>
            </div>

            <div className={cn(
                "rounded-2xl p-4 flex flex-col gap-3 transition-all",
                editing ? "bg-base-100 shadow-inner" : "bg-base-100/60"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/20">
                        <Clock size={12} strokeWidth={3} />
                        {t('shifts.workInterval')}
                    </div>
                    {duration && (
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase">
                            {duration}
                        </span>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3">
                        <Controller
                            name="actualStartTime"
                            control={control}
                            render={({field}) => (
                                <input
                                    type="time"
                                    className="w-full h-11 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 transition-all font-black text-center text-lg outline-none"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <span className="font-black text-base-content/20">—</span>
                        <Controller
                            name="actualEndTime"
                            control={control}
                            render={({field}) => (
                                <input
                                    type="time"
                                    className="w-full h-11 px-4 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/20 transition-all font-black text-center text-lg outline-none"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        
                        <div className="flex items-center gap-1 pl-1">
                            <button type="submit" className="h-11 w-11 rounded-xl bg-success/10 text-success flex items-center justify-center active:scale-90 transition-all">
                                <Check size={20} strokeWidth={3}/>
                            </button>
                            <button type="button" onClick={onCancel} className="h-11 w-11 rounded-xl bg-base-200 text-base-content/40 flex items-center justify-center active:scale-90 transition-all">
                                <X size={20} strokeWidth={3}/>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center justify-center gap-4 py-1">
                        <span className="text-3xl font-black text-base-content tracking-tighter">
                            {formatTime(shift.actualStartTime ?? template?.startTime)}
                        </span>
                        <div className="w-8 h-0.5 bg-base-200 rounded-full" />
                        <span className="text-3xl font-black text-base-content/40 tracking-tighter">
                            {formatTime(shift.actualEndTime ?? template?.endTime)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

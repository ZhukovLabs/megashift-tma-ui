"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useTranslations} from "next-intl";
import {formatInTimeZone} from "date-fns-tz";
import {BaseShiftModal, ShiftFormValues} from "./base-shift-modal";
import {useUpdateShiftTemplate, useGetShiftTemplate} from "@/features/shift-template/api";
import {useUserStore} from "@/entities/user";

export function UpdateShiftModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('shifts');
    const tz = useUserStore(s => s.user?.timezone ?? "UTC");

    const shiftId = searchParams.get("shiftId");
    const isOpen = Boolean(shiftId && shiftId !== "new");

    const {data: shift, isLoading} = useGetShiftTemplate(isOpen ? shiftId! : "");
    const {mutateAsync, isPending} = useUpdateShiftTemplate();

    const close = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("shiftId");
        router.replace(`?${params.toString()}`);
    };

    const initialValues: ShiftFormValues | undefined = shift
        ? {
            label: shift.label,
            color: shift.color ?? "#3b82f6",
            startTime: formatInTimeZone(shift.startTime, tz, "HH:mm"),
            endTime: formatInTimeZone(shift.endTime, tz, "HH:mm"),
        }
        : undefined;

    const handleUpdate = async (data: ShiftFormValues) => {
        await mutateAsync({id: shiftId!, ...data});
        close();
    };

    return (
        <BaseShiftModal
            isOpen={isOpen}
            title={t('edit')}
            submitLabel={t('save')}
            initialValues={initialValues}
            isLoading={isLoading}
            isPending={isPending}
            onClose={close}
            onSubmit={handleUpdate}
        />
    );
}

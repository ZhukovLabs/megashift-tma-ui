"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useTranslations} from 'next-intl';
import {BaseShiftModal, ShiftFormValues} from "./base-shift-modal";
import {useCreateShiftTemplate} from "@/features/shift-template/api";

export function CreateShiftModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('shifts');

    const isOpen = searchParams.get("shiftId") === "new";
    const {mutateAsync, isPending} = useCreateShiftTemplate();

    const close = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("shiftId");
        router.replace(`?${params.toString()}`);
    };

    const handleCreate = async (data: ShiftFormValues) => {
        await mutateAsync(data);
        close();
    };

    return (
        <BaseShiftModal
            isOpen={isOpen}
            title={t('create.title')}
            submitLabel={t('create.submitLabel')}
            isPending={isPending}
            onClose={close}
            onSubmit={handleCreate}
        />
    );
}

'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";

import {Schedule, ScheduleProvider, CalendarEvent} from "@/features/schedule/ui";
import {AdvancedBottomMenu} from "@/features/schedule/ui/advanced-bottom-menu";
import {ShiftModal} from "@/features/schedule/ui/schedule-shift-modal";

import {useGetShifts, useCreateShift, useDeleteShift} from "@/features/shift/api";
import {useScheduleStore} from "@/features/schedule/model";

export function SchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const router = useRouter();

    const {data: shifts = []} = useGetShifts({year, month});
    const {mutateAsync: createShift} = useCreateShift();
    const {mutateAsync: deleteShift} = useDeleteShift();
    const selectedShiftId = useScheduleStore((s) => s.selectedShiftId);
    const setEditIsOpen = useScheduleStore(s => s.setEditIsOpen);
    const setSelectedShiftId = useScheduleStore(s => s.setSelectedShiftId);

    useEffect(() => () => {
        setEditIsOpen(false);
        setSelectedShiftId(null);
    }, [setEditIsOpen, setSelectedShiftId]);

    const handleDayClick = async (day: Date, events: CalendarEvent[]) => {
        const dateStr = format(day, "yyyy-MM-dd");

        if (!selectedShiftId) {
            const url = new URL(window.location.href);
            url.searchParams.set("date", dateStr);
            router.replace(url.toString());
            return;
        }

        const exists = events.find(
            (e) =>
                e.shiftTemplateId === selectedShiftId &&
                !e.actualStartTime &&
                !e.actualEndTime
        );

        if (exists) {
            await deleteShift({
                id: exists.id,
                year,
                month,
            });
        } else {
            await createShift({
                date: dateStr,
                revalidateDate: format(currentDate, "yyyy-MM-dd"),
                shiftTemplateId: selectedShiftId,
            });
        }
    };

    return (
        <div className="h-full w-full overflow-hidden">
            <ScheduleProvider
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                shifts={shifts}
                onDayClick={handleDayClick}
            >
                <Schedule/>
            </ScheduleProvider>

            <AdvancedBottomMenu/>

            <ShiftModal/>
        </div>
    );
}

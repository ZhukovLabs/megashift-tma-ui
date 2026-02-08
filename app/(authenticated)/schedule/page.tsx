'use client';

import {useState} from "react";
import {Schedule} from "@/components/schedule";
import {ScheduleProvider, CalendarEvent} from "@/components/schedule/context";
import {AdvancedBottomMenu} from "@/components/advenced-bottom-menu";
import {useGetShifts} from "@/api-hooks/use-get-shifts";
import {useCreateShift} from "@/api-hooks/use-create-shift";
import {useDeleteShift} from "@/api-hooks/use-delete-shift";
import {useScheduleStore} from "@/store/schedule-store";
import {ShiftModal} from "@/components/schedule-shift-modal";
import {format} from "date-fns";

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const {data: shifts = []} = useGetShifts({year, month});
    const {mutateAsync: createShift}= useCreateShift();
    const {mutateAsync: deleteShift}= useDeleteShift();
    const selectedShiftId = useScheduleStore(s => s.selectedShiftId);

    const handleDayClick = async (day: Date, events: CalendarEvent[]) => {
        const dateStr = format(day, "yyyy-MM-dd");

        if (!selectedShiftId) {
            const url = new URL(window.location.href);
            url.searchParams.set("date", dateStr);
            window.history.replaceState({}, "", url.toString());
            return;
        }

        const exists = events.find(e =>
            e.shiftTemplateId === selectedShiftId &&
            !e.actualStartTime &&
            !e.actualEndTime
        );

        if (exists) {
            await deleteShift(exists.id);
        } else {
            await createShift({
                date: format(day, "yyyy-MM-dd"),
                shiftTemplateId: selectedShiftId
            });
        }
    };

    return (
        <>
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
        </>
    );
};

export default SchedulePage;

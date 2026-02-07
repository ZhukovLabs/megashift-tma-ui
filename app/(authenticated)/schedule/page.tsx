// app/schedule/page.tsx
'use client';

import {useState} from "react";
import {format} from "date-fns";
import {Schedule} from "@/components/schedule";
import {ScheduleProvider, CalendarEvent} from "@/components/schedule/context";
import {AdvancedBottomMenu} from "@/components/advenced-bottom-menu";
import {useGetShifts} from "@/api-hooks/use-get-shifts";
import {useCreateShift} from "@/api-hooks/use-create-shift";
import {useDeleteShift} from "@/api-hooks/use-delete-shift";
import {useScheduleStore} from "@/store/schedule-store";

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // date-fns month индексируется с 0

    const {data: shifts = []} = useGetShifts({ year, month });

    const selectedShiftId = useScheduleStore(s => s.selectedShiftId);
    const {mutateAsync: createShift} = useCreateShift();
    const {mutateAsync: deleteShift} = useDeleteShift();

    const handleDayClick = async (day: Date, events: CalendarEvent[]) => {
        if (!selectedShiftId) return;

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
        </>
    );
};

export default SchedulePage;

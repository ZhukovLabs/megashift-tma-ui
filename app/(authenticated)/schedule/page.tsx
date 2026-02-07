'use client';

import {Schedule} from "@/components/schedule";
import {ScheduleProvider} from "@/components/schedule/context";

import {AdvancedBottomMenu} from "@/components/advenced-bottom-menu";
import {useGetShifts} from "@/api-hooks/use-get-shifts";
import {useCreateShift} from "@/api-hooks/use-create-shift";
import {useScheduleStore} from "@/store/schedule-store";
import {format} from "date-fns";

const SchedulePage = () => {
    const {data: shifts = []} = useGetShifts({
        year: 2026,
        month: 2,
    })

    const selectedShiftId = useScheduleStore(s => s.selectedShiftId);
    const {mutateAsync: createShift} = useCreateShift();

    const handleCreateShift = async (day: Date) => {
        if (!selectedShiftId) return;
        await createShift({
            date: format(day, "yyyy-MM-dd"),
            shiftTemplateId: selectedShiftId
        })
    }

    return <>
        <ScheduleProvider shifts={shifts} onDayClick={handleCreateShift}>
            <Schedule/>
        </ScheduleProvider>
        <AdvancedBottomMenu/>
    </>;
}

export default SchedulePage;
'use client';

import {Schedule} from "@/components/schedule";
import {ScheduleProvider} from "@/components/schedule/context";

import {CalendarEvent} from "@/components/schedule/context";
import {AdvancedBottomMenu} from "@/components/advenced-bottom-menu";
import {Edit2, X} from "lucide-react";
import {useGetShiftTemplates} from "@/api-hooks/use-get-shift-templates";

const februaryEvents: CalendarEvent[] = [
    {
        id: "1",
        date: new Date(2026, 1, 3),
        title: "Встреча с командой",
        color: "#3b82f6",
    },
    {
        id: "92",
        date: new Date(2026, 1, 3),
        title: "Встреча с командой",
        color: "#8382f6",
    },
    {
        id: "93",
        date: new Date(2026, 1, 3),
        title: "Встреча с командой",
        color: "#3122f6",
    },
    {
        id: "2",
        date: new Date(2026, 1, 5),
        title: "Доклад по проекту",
        color: "#f97316",
    },
    {
        id: "3",
        date: new Date(2026, 1, 7),
        title: "Онлайн-конференция",
        color: "#10b981",
    },
    {
        id: "4",
        date: new Date(2026, 1, 10),
        title: "Совещание с клиентом",
        color: "#8b5cf6",
    },
    {
        id: "5",
        date: new Date(2026, 1, 12),
        title: "Вебинар по дизайну",
        color: "#f43f5e",
    },
    {
        id: "6",
        date: new Date(2026, 1, 15),
        title: "Контрольный звонок",
        color: "#fbbf24",
    },
    {
        id: "7",
        date: new Date(2026, 1, 20),
        title: "Презентация проекта",
        color: "#3b82f6",
    },
    {
        id: "8",
        date: new Date(2026, 1, 25),
        title: "Отчет по задачам",
        color: "#10b981",
    },
];

const SchedulePage = () => {
    const {data: shifts = [], isLoading} = useGetShiftTemplates();

    return <>
        <ScheduleProvider events={februaryEvents} onEventClick={(e) => {
            alert(e.title)
        }}>
            <Schedule/>
        </ScheduleProvider>
        <AdvancedBottomMenu
            items={shifts}
            openIcon={<Edit2 size={24}/>}
            closeIcon={<X size={24}/>}
        />
    </>;
}

export default SchedulePage;
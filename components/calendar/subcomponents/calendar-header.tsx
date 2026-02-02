import {format} from "date-fns";
import {ru} from "date-fns/locale";

type CalendarHeaderProps = {
    currentDate: Date;
    onToday: VoidFunction;
}

export const CalendarHeader = ({
                                   currentDate,
                                   onToday,
                               }: CalendarHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {format(currentDate, "LLLL yyyy", {locale: ru})}
            </h1>

            <button className="btn btn-sm btn-outline" onClick={onToday}>
                Сегодня
            </button>
        </div>
    );
}

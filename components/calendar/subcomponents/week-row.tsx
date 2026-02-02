import {addDays, isSameMonth} from "date-fns";
import {DayCell} from "./day-cell";
import cn from 'classnames';

type WeekRowProps = {
    weekStart: Date;
    cellHeight: number;
};

export const WeekRow = ({
                            weekStart,
                            cellHeight,
                        }: WeekRowProps) => {
    const cells = [];

    for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const isCurrentMonth = isSameMonth(day, weekStart);

        const cellClasses = cn(
            "flex justify-center rounded-lg transition-colors",
            isCurrentMonth && "hover:bg-base-200/70 cursor-pointer",
            !isCurrentMonth && "pointer-events-none"
        )

        cells.push(
            <div
                key={day.getTime()}
                style={{height: cellHeight}}
                className={cellClasses}
            >
                <DayCell day={day}/>
            </div>
        );
    }

    return <div className="grid grid-cols-7 gap-1.5">{cells}</div>;
}
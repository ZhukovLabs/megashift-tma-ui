import {addDays, isSameMonth} from "date-fns";
import {DayCell} from "./day-cell";
import cn from 'classnames';

type WeekRowProps = {
    weekStart: Date;
    date: Date;
    cellHeight: number;
};

export const WeekRow = ({
                            weekStart,
                            cellHeight,
    date,
                        }: WeekRowProps) => {
    const cells = [];

    for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);

        const cellClasses = cn(
            "flex justify-center rounded-lg transition-colors",
            "hover:bg-base-200/70 cursor-pointer"
        )

        cells.push(
            <div
                key={day.getTime()}
                style={{height: cellHeight}}
                className={cellClasses}
            >
                <DayCell day={day} date={date}/>
            </div>
        );
    }

    return <div className="grid grid-cols-7 gap-1.5">{cells}</div>;
}
import {addDays} from "date-fns";
import React from "react";
import {getMonthDates} from "../utils";
import {WeekRow} from "./week-row";


export const MonthGrid = ({
                              date,
                              cellHeight,
                          }: {
    date: Date;
    cellHeight: number;
}) => {
    const {startDate} = getMonthDates(date);

    const rows = [];

    for (let w = 0; w < 6; w++) {
        const weekStart = addDays(startDate, w * 7);
        rows.push(
            <WeekRow
                key={w}
                date={date}
                weekStart={weekStart}
                cellHeight={cellHeight}
            />
        );
    }

    return <div className="space-y-1.5">{rows}</div>;
}
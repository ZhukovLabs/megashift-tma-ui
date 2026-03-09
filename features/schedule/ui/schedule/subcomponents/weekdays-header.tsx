import { DAYS } from '@/features/schedule/model';

export const WeekdaysHeader = () => {
    return (
        <div className="grid grid-cols-7 text-center text-sm font-medium text-base-content/60 mb-2">
            {DAYS.map((day) => (
                <div key={day} className="py-1">
                    {day}
                </div>
            ))}
        </div>
    );
}

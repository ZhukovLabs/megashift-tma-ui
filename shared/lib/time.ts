import { parseISO, differenceInMinutes, addDays } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

export const isTimeOnly = (s?: string) => !!s && /^\d{1,2}:\d{2}(:\d{2})?$/.test(s);

export const resolveToUtcDate = (time?: string, dateStr?: string, tz: string = 'UTC') => {
    if (!time) return null;
    try {
        if (isTimeOnly(time)) {
            if (!dateStr) return null;
            const timePart = time.length === 5 ? `${time}:00` : time;
            return fromZonedTime(`${dateStr}T${timePart}`, tz);
        }
        if (/[Z+-]/.test(time)) return parseISO(time);
        return fromZonedTime(time, tz);
    } catch {
        return null;
    }
};

export const formatTime = (time?: string, dateStr?: string, tz: string = 'UTC') => {
    if (!time) return '--:--';
    try {
        if (isTimeOnly(time)) {
            if (!dateStr) return time;
            const timePart = time.length === 5 ? `${time}:00` : time;
            return formatInTimeZone(`${dateStr}T${timePart}`, tz, 'HH:mm');
        }
        return formatInTimeZone(time, tz, 'HH:mm');
    } catch {
        return '--:--';
    }
};

export const getDuration = (start?: string, end?: string, dateStr?: string, tz: string = 'UTC') => {
    const startUtc = resolveToUtcDate(start, dateStr, tz);
    let endUtc = resolveToUtcDate(end, dateStr, tz);
    if (!startUtc || !endUtc) return null;
    if (endUtc <= startUtc) endUtc = addDays(endUtc, 1);
    const minutes = differenceInMinutes(endUtc, startUtc);
    if (minutes <= 0) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}ч ${m.toString().padStart(2, '0')}м`;
};

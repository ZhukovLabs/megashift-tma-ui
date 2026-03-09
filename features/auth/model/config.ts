import { getTimezoneOffset } from "date-fns-tz";

export const TIMEZONES = [
    { label: "UTC", tz: "UTC" },
    { label: "Минск", tz: "Europe/Minsk" },
    { label: "Москва", tz: "Europe/Moscow" },
    { label: "Лондон", tz: "Europe/London" },
    { label: "Париж", tz: "Europe/Paris" },
    { label: "Нью-Йорк", tz: "America/New_York" },
    { label: "Чикаго", tz: "America/Chicago" },
    { label: "Лос-Анджелес", tz: "America/Los_Angeles" },
    { label: "Токио", tz: "Asia/Tokyo" },
    { label: "Шанхай", tz: "Asia/Shanghai" },
    { label: "Калькутта", tz: "Asia/Kolkata" },
];

export const getCurrentTimeInTZ = (tz: string) => {
    const now = new Date();
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(now);
};

export const getOffset = (tz: string, date = new Date()): string | null => {
    const offsetMs = getTimezoneOffset(tz, date);
    if (Number.isNaN(offsetMs)) return null;

    const totalMinutes = offsetMs / 60_000;
    const sign = totalMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(Math.round(totalMinutes));
    const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
    const minutes = String(absMinutes % 60).padStart(2, "0");

    return `${sign}${hours}:${minutes}`;
};

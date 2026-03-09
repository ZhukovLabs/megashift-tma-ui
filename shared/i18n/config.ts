export const defaultLocale = 'ru';

export const timeZone = 'Europe/Amsterdam';

export const locales = [defaultLocale, 'en'] as const;

export const localesMap = [
    {key: 'ru', title: 'Русский'},
    {key: 'en', title: 'English'},
];

'use server';

import { cookies } from 'next/headers';
import { locales, defaultLocale } from './config';
import type { Locale } from './types';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function setLocale(locale: string) {
    const validLocale = locales.includes(locale as typeof locales[number]) 
        ? locale 
        : defaultLocale;
    
    (await cookies()).set(COOKIE_NAME, validLocale as Locale);
}

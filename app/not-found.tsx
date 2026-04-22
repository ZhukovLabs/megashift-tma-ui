'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {useTranslations} from 'next-intl';

export default function NotFoundPage() {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const historyRef = useRef<string[]>([]);

    useEffect(() => {
        if (pathname && historyRef.current[historyRef.current.length - 1] !== pathname) {
            historyRef.current.push(pathname);
        }
    }, [pathname]);

    const handleReportClick = () => {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const to = 'deniszhukov.hachiko@gmail.com';
        const subject = encodeURIComponent(`${t('errors.title')} — 404`);
        const body = encodeURIComponent(
            `URL: ${pathname || '/'}\n` +
            `UserAgent: ${ua}\n` +
            `History:\n${historyRef.current.join('\n')}\n\n${t('errors.describeAction')}`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
            <div className="text-6xl mb-4 animate-bounce">🛸</div>
            <h1 className="text-4xl font-bold mb-2">{t('errors.pageNotFoundTitle')}</h1>
            <p className="text-center text-base-content/70 mb-6">
                {t('errors.pageNotFound')}
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    className="btn btn-primary btn-block"
                    onClick={() => router.replace('/')}
                >
                    {t('navigation.home')}
                </button>

                <button
                    className="btn btn-outline btn-block"
                    onClick={handleReportClick}
                >
                    {t('navigation.reportProblem')}
                </button>
            </div>

            <p className="text-xs text-base-content/50 mt-6 text-center">
                {t('errors.pageNotFoundMagic')}
            </p>
        </main>
    );
}

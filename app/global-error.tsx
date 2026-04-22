'use client';

import './globals.css';
import {Geist, Geist_Mono} from 'next/font/google';
import Link from "next/link";
import {ROUTES} from "@/shared/constants/routes";
import {useTranslations} from "next-intl";

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

interface GlobalErrorProps {
    error: Error;
    reset: () => void;
}

export default function GlobalError({error, reset}: GlobalErrorProps) {
    const t = useTranslations();
    const handleReportClick = () => {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const to = 'deniszhukov.hachiko@gmail.com';
        const subject = encodeURIComponent(t('errors.globalTitle'));
        const body = encodeURIComponent(
            `${t('common.error')}: ${error.message}\n` +
            `Stack: ${error.stack || 'none'}\n` +
            `UserAgent: ${ua}\n\n${t('errors.describeAction')}`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <html lang="ru">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 flex flex-col items-center justify-center min-h-screen p-6`}
        >
        <div className="text-6xl mb-4 animate-bounce">💥</div>
        <h1 className="text-4xl font-bold mb-2 text-center">{t('errors.globalTitle')}</h1>
        <p className="text-center text-base-content/70 mb-6">
            {t('errors.globalDescription')}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link
                className="btn btn-primary btn-block"
                href={ROUTES.root}
            >
                {t('navigation.home')}
            </Link>

            <button
                className="btn btn-outline btn-block"
                onClick={handleReportClick}
            >
                {t('navigation.reportProblem')}
            </button>

            <button
                className="btn btn-secondary btn-block"
                onClick={() => reset()}
            >
                {t('navigation.tryAgain')}
            </button>
        </div>

        <p className="text-xs text-base-content/50 mt-6 text-center">
            {t('errors.autoReport')}
        </p>
        </body>
        </html>
    );
}

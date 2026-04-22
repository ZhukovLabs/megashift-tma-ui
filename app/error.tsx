'use client';

import Link from "next/link";
import {ROUTES} from "@/shared/constants/routes";
import {useTranslation} from "react-i18next";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function GlobalError({error, reset}: ErrorProps) {
    const {t} = useTranslation();
    const handleReportClick = () => {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const to = 'deniszhukov.hachiko@gmail.com';
        const subject = encodeURIComponent(t('errors.title'));
        const body = encodeURIComponent(
            `${t('common.error')}: ${error.message}\n` +
            `Stack: ${error.stack || 'none'}\n` +
            `UserAgent: ${ua}\n\n${t('errors.describeAction')}`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
            <div className="text-6xl mb-4 animate-bounce">💥</div>
            <h1 className="text-4xl font-bold mb-2 text-center">{t('errors.title')}</h1>
            <p className="text-center text-base-content/70 mb-6">
                {t('errors.description')}
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
        </main>
    );
}

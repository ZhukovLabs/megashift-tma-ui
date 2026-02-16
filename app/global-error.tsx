'use client';

import './globals.css';
import {useRouter} from 'next/navigation';
import {Geist, Geist_Mono} from 'next/font/google';
import Link from "next/link";
import {ROUTES} from "@/constants/routes";

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

interface GlobalErrorProps {
    error: Error;
    reset: () => void;
}

export default function GlobalError({error, reset}: GlobalErrorProps) {
    const handleReportClick = () => {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const to = 'support@example.com';
        const subject = encodeURIComponent('Глобальная ошибка приложения');
        const body = encodeURIComponent(
            `Ошибка: ${error.message}\n` +
            `Stack: ${error.stack || 'нет'}\n` +
            `UserAgent: ${ua}\n\nОпиши, что делал(а):`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <html lang="ru">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 flex flex-col items-center justify-center min-h-screen p-6`}
        >
        <div className="text-6xl mb-4 animate-bounce">💥</div>
        <h1 className="text-4xl font-bold mb-2 text-center">Что-то пошло не так</h1>
        <p className="text-center text-base-content/70 mb-6">
            Глобальная ошибка приложения. Не переживай, мы всё исправим!
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link
                className="btn btn-primary btn-block"
                href={ROUTES.root}
            >
                На главную
            </Link>

            <button
                className="btn btn-outline btn-block"
                onClick={handleReportClick}
            >
                Сообщить о проблеме
            </button>

            <button
                className="btn btn-secondary btn-block"
                onClick={() => reset()}
            >
                Попробовать снова
            </button>
        </div>

        <p className="text-xs text-base-content/50 mt-6 text-center">
            Мы автоматически получим сообщение о проблеме, если нажмёшь кнопку выше.
        </p>
        </body>
        </html>
    );
}

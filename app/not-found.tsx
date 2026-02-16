'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function NotFoundPage() {
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
        const subject = encodeURIComponent('Ошибка в приложении — 404');
        const body = encodeURIComponent(
            `Текущий URL: ${pathname || '/'}\n` +
            `UserAgent: ${ua}\n` +
            `История посещённых страниц:\n${historyRef.current.join('\n')}\n\nОпиши, что делал(а):`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
            <div className="text-6xl mb-4 animate-bounce">🛸</div>
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-center text-base-content/70 mb-6">
                Похоже, эта страница потерялась.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    className="btn btn-primary btn-block"
                    onClick={() => router.replace('/')}
                >
                    На главную
                </button>

                <button
                    className="btn btn-outline btn-block"
                    onClick={handleReportClick}
                >
                    Сообщить о проблеме
                </button>
            </div>

            <p className="text-xs text-base-content/50 mt-6 text-center">
                Иногда страницы любят исчезать… 🪄
            </p>
        </main>
    );
}

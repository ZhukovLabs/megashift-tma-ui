'use client';

export function SkeletonPage() {
    return (
        <div className="flex items-center justify-center min-h-[100dvh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
                <p className="text-base-content/60">Загрузка...</p>
            </div>
        </div>
    );
}

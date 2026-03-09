'use client';

import {ReactNode} from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

export function SafeContentArea({children, className}: Props) {
    return (
        <div
            className={`min-h-[100dvh] w-full max-w-lg mx-auto bg-base-200 ${className ?? ''}`}
        >
            {children}
        </div>
    );
}

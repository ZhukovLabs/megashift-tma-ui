'use client';

import {ReactNode, useEffect, useState} from 'react';
import {viewport} from "@tma.js/sdk-react";

type Props = {
    children: ReactNode;
    className?: string;
};

export function SafeContentArea({children, className}: Props) {
    const [insets, setInsets] = useState({top: 0, bottom: 0});

    useEffect(() => {
        try {
            const safeInsets = viewport.contentSafeAreaInsets();
            setInsets({
                top: safeInsets?.top ?? 0,
                bottom: safeInsets?.bottom ?? 0,
            });
        } catch (e) {
            console.error("Failed to get viewport insets", e);
        }
    }, []);

    return (
        <div
            className={`w-full max-w-lg mx-auto flex flex-col relative overflow-hidden h-screen h-[100dvh] ${className ?? ''}`}
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }}
        >
            {children}
        </div>
    );
}

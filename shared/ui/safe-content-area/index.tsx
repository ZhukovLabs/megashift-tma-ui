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
            className={`w-full max-w-lg mx-auto flex flex-col relative overflow-hidden h-[100dvh] bg-base-100 ${className ?? ''}`}
        >
            {/* 
                Top Guard: Physically blocks any content from being visible 
                in the system safe area (status bar).
            */}
            <div 
                className="fixed top-0 left-0 right-0 z-[100] bg-base-100 pointer-events-none" 
                style={{ height: insets.top + 1 }} // +1px to avoid rounding gaps
            />
            
            <div 
                className="flex-1 flex flex-col min-h-0 relative"
                style={{ marginTop: insets.top }}
            >
                {children}
            </div>

            <div style={{ height: insets.bottom }} className="shrink-0 bg-base-100" />
        </div>
    );
}

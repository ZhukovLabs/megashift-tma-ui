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
        const safeInsets = viewport.safeAreaInsets();
        setInsets({
            top: safeInsets?.top ?? 0,
            bottom: safeInsets?.bottom ?? 0,
        });
    }, []);

    return (
        <div
            className={`h-[calc(100dvh - ${insets.top}px - ${insets.bottom}px)] w-full max-w-lg mx-auto ${className ?? ''}`}
            style={{paddingTop: insets.top, paddingBottom: insets.bottom}}
        >
            {children}
        </div>
    );
}

'use client';

import {useSignal, viewport} from "@tma.js/sdk-react";

type SafeContentAreaProps = {
    children: React.ReactNode;
}

export const SafeContentArea = ({children}: SafeContentAreaProps) => {
    const {top, left, right, bottom} = useSignal(viewport.contentSafeAreaInsets);

    return <div style={{
        padding: `${top}px ${right+5}px ${bottom}px ${left+5}px`,
        maxWidth: `calc(100vw - ${left}px - ${right}px)`
    }}>
        {children}
    </div>
}
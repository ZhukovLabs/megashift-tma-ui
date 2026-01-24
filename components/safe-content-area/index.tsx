'use client';

import {useSignal, viewport} from "@tma.js/sdk-react";
import {clsx} from "clsx";

type SafeContentAreaProps = {
    children: React.ReactNode;
    className?: string;
}

const SIDE_PADDINGS = 5;

export const SafeContentArea = ({children, className}: SafeContentAreaProps) => {
    const {top, left, right, bottom} = useSignal(viewport.contentSafeAreaInsets);

    const dynamicStyles = {
        padding: `${top}px ${right + SIDE_PADDINGS}px ${bottom}px ${left + SIDE_PADDINGS}px`,
        maxWidth: `calc(100vw - ${left}px - ${right}px)`,
    };

    return (
        <div
            style={dynamicStyles}
            className={clsx(
                "overflow-x-auto",
                "w-full",
                "md:overflow-x-visible",
                className
            )}
        >
            {children}
        </div>
    );
};
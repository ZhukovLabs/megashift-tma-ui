'use client';

import {useSignal, viewport} from "@tma.js/sdk-react";
import {clsx} from "clsx";
import {useEffect, useState} from "react";

type SafeContentAreaProps = {
    children: React.ReactNode;
    className?: string;
};

const INNER_PADDING = 5;

export const SafeContentArea = ({children, className}: SafeContentAreaProps) => {
    const [{top, left, right, bottom}, setInsets] = useState({top: 0, left: 0, right: 0, bottom: 0});

    const safeInsets = useSignal(viewport.contentSafeAreaInsets);

    useEffect(() => {
        setInsets(safeInsets);
    }, [safeInsets]);

    return (
        <div
            style={{
                paddingTop: top + INNER_PADDING,
                paddingLeft: left + INNER_PADDING,
                paddingRight: left + INNER_PADDING,
                paddingBottom: bottom + INNER_PADDING,
                maxWidth: `calc(100vw - ${left + right + 2 * INNER_PADDING}px)`
            }}
            className={clsx("mx-auto w-full max-h-screen h-full overflow-x-hidden", className)}
        >
            {children}
        </div>
    );
};
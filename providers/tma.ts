'use client';

import {init, viewport} from '@tma.js/sdk-react';
import {useEffect} from 'react';

export function TmaInit() {
    useEffect(() => {
        init();
        viewport.mount();
    }, []);

    return null;
}

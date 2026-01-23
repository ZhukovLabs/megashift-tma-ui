'use client';

import {init} from '@tma.js/sdk-react';
import {useEffect} from 'react';

export function TmaInit() {
    useEffect(() => {
        init();
    }, []);

    return null;
}

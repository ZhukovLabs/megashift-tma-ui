'use client';

import {init, viewport, requestWriteAccess} from '@tma.js/sdk-react';
import {useEffect} from 'react';

export function TmaInit() {
    useEffect(() => {
        init();
        viewport.mount();
        (async () => {
            const status = await requestWriteAccess();
            alert('status:' + status);
        })();

    }, []);

    return null;
}

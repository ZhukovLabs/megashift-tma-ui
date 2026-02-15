'use client';
import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';

type UsePrefetchParams = {
    urls: string[];
    enabled?: boolean;
};

export const usePrefetch = ({urls, enabled = true}: UsePrefetchParams) => {
    const router = useRouter();
    const prefetchedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!enabled || urls.length === 0) return;

        urls.forEach((url) => {
            if (!prefetchedRef.current.has(url)) {
                prefetchedRef.current.add(url);
                router.prefetch(url);
            }
        });
    }, [urls, enabled, router]);
};

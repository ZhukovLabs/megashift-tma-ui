'use client';

import { deviceStorage as TmaDeviceStorage } from '@tma.js/sdk';

export const deviceStorage = {
    get: async (key: string): Promise<string | null> => {
        return TmaDeviceStorage.getItem(key);
    },

    set: async (key: string, value: string | null): Promise<void> => {
        return TmaDeviceStorage.setItem(key, value);
    },

    clear: async (): Promise<void> => {
        return TmaDeviceStorage.clear();
    },
};
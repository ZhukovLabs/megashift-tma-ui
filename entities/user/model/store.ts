import { AccessClaim } from '@/entities/access';
import {create} from "zustand/index";
import {User} from "./types";
import { deviceStorage } from '@/shared/lib/device-storage';

type UserState = {
    user: User | null;
    status: AuthStatus;
    isInitialized: boolean;
    ownerId: string | null;
    currentClaims: (keyof typeof AccessClaim)[] | null;

    initialize: () => void;
    loadOwnerId: () => Promise<void>;
    loadCurrentClaims: () => Promise<void>;
    setUser: (user: User) => void;
    setOwnerId: (id: string | null) => void;
    setCurrentClaims: (claims: (keyof typeof AccessClaim)[] | null) => void,
    setUnauthenticated: () => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    status: 'idle',
    isInitialized: false,
    ownerId: null,
    currentClaims: null,

    initialize: () => {
        if (!get().isInitialized && get().status !== 'initializing') {
            set({status: 'initializing', isInitialized: false});
        }
    },

    loadOwnerId: async () => {
        try {
            const savedOwnerId = await deviceStorage.get('ownerId');
            if (savedOwnerId) {
                set({ownerId: savedOwnerId});
            }
        } catch (e) {
            console.error('Failed to load ownerId from deviceStorage', e);
        }
    },

    loadCurrentClaims: async () => {
        try {
            const savedClaims = await deviceStorage.get('currentClaims');
            if (savedClaims) {
                const parsedClaims = JSON.parse(savedClaims) as (keyof typeof AccessClaim)[];
                set({currentClaims: parsedClaims});
            }
        } catch (e) {
            console.error('Failed to load currentClaims from deviceStorage', e);
        }
    },

    setCurrentClaims: (claims: (keyof typeof AccessClaim)[] | null) => {
        set({currentClaims: claims});

        if (claims !== null) {
            deviceStorage.set('currentClaims', JSON.stringify(claims)).catch((e) => {
                console.error('Failed to save currentClaims to deviceStorage', e);
            });
        } else {
            deviceStorage.set('currentClaims', null).catch((e) => {
                console.error('Failed to remove currentClaims from deviceStorage', e);
            });
        }
    },

    setUser: (user) => set({user, status: 'authenticated', isInitialized: true}),

    setOwnerId: (id: string | null) => {
        set({ownerId: id});

        if (id !== null) {
            deviceStorage.set('ownerId', id).catch((e) => {
                console.error('Failed to save ownerId to deviceStorage', e);
            });
        } else {
            deviceStorage.set('ownerId', null).catch((e) => {
                console.error('Failed to remove ownerId from deviceStorage', e);
            });
        }
    },

    setUnauthenticated: () => set({user: null, status: 'unauthenticated', isInitialized: true, ownerId: null}),
    logout: () => {
        deviceStorage.set('ownerId', null).catch((e) => {
            console.error('Failed to remove ownerId from deviceStorage on logout', e);
        });
        deviceStorage.set('currentClaims', null).catch((e) => {
            console.error('Failed to remove currentClaims from deviceStorage on logout', e);
        });
        set({user: null, status: 'unauthenticated', isInitialized: true, ownerId: null, currentClaims: null});
    },
}));

export type AuthStatus = 'idle' | 'initializing' | 'authenticated' | 'unauthenticated';
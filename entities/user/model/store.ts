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

    setCurrentClaims: (claims: (keyof typeof AccessClaim)[] | null) => set({currentClaims: claims}),

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
    logout: () => set({user: null, status: 'unauthenticated', isInitialized: true, ownerId: null}),
}));

export type AuthStatus = 'idle' | 'initializing' | 'authenticated' | 'unauthenticated';
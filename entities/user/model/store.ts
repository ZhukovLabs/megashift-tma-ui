import { AccessClaim } from '@/entities/access';
import {create} from "zustand/index";
import {User} from "./types";

type UserState = {
    user: User | null;
    status: AuthStatus;
    isInitialized: boolean;
    ownerId: string | null;
    currentClaims: (keyof typeof AccessClaim)[] | null;

    initialize: () => void;
    setUser: (user: User) => void;
    setOwnerId: (id: string | null) => void;
    setCurrentClaims: (claims: (keyof typeof AccessClaim)[] | null) => void,
    setUnauthenticated: () => void;
    logout: () => void;
};

// Простая обертка над sessionStorage для консистентности (так как в TMA обычно используется session или cloud)
// Но по запросу используем session-ориентированное поведение для deviceStorage
const storage = typeof window !== 'undefined' ? window.sessionStorage : null;

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    status: 'idle',
    isInitialized: false,
    ownerId: storage ? storage.getItem('ownerId') : null,
    currentClaims: null,

    initialize: () => {
        if (!get().isInitialized && get().status !== 'initializing') {
            set({status: 'initializing', isInitialized: false});
        }
    },

    setCurrentClaims: (claims: (keyof typeof AccessClaim)[] | null) => set({currentClaims: claims}),

    setUser: (user) => set({user, status: 'authenticated', isInitialized: true}),

    setOwnerId: (id: string | null) => {
        set({ownerId: id});

        if (storage) {
            if (id !== null) {
                storage.setItem('ownerId', id);
            } else {
                storage.removeItem('ownerId');
            }
        }
    },

    setUnauthenticated: () => set({user: null, status: 'unauthenticated', isInitialized: true, ownerId: null}),
    logout: () => set({user: null, status: 'unauthenticated', isInitialized: true, ownerId: null}),
}));

export type AuthStatus = 'idle' | 'initializing' | 'authenticated' | 'unauthenticated';
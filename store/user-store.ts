import { create } from 'zustand';

export type User = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    timezone: string;
};

export type AuthStatus = 'idle' | 'initializing' | 'authenticated' | 'unauthenticated';

type UserState = {
    user: User | null;
    status: AuthStatus;
    isInitialized: boolean;
    ownerId: string | null;

    initialize: () => void;
    setUser: (user: User) => void;
    setOwnerId: (id: string | null) => void;
    setUnauthenticated: () => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    status: 'idle',
    isInitialized: false,
    ownerId: typeof window !== 'undefined' ? localStorage.getItem('ownerId') : null,

    initialize: () => {
        if (!get().isInitialized && get().status !== 'initializing') {
            set({ status: 'initializing', isInitialized: false });
        }
    },

    setUser: (user) => set({ user, status: 'authenticated', isInitialized: true }),

    setOwnerId: (id: string | null) => {
        set({ ownerId: id });

        if (typeof window !== 'undefined') {
            if (id !== null) {
                localStorage.setItem('ownerId', id);
            } else {
                localStorage.removeItem('ownerId');
            }
        }
    },

    setUnauthenticated: () => set({ user: null, status: 'unauthenticated', isInitialized: true, ownerId: null }),
    logout: () => set({ user: null, status: 'unauthenticated', isInitialized: true, ownerId: null }),
}));


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

    initialize: () => void;
    setUser: (user: User) => void;
    setUnauthenticated: () => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    status: 'idle',
    isInitialized: false,

    initialize: () => {
        if (!get().isInitialized && get().status !== 'initializing') {
            set({ status: 'initializing', isInitialized: false });
        }
    },

    setUser: (user) => set({ user, status: 'authenticated', isInitialized: true }),

    setUnauthenticated: () => set({ user: null, status: 'unauthenticated', isInitialized: true }),

    logout: () => set({ user: null, status: 'unauthenticated', isInitialized: true }),
}));

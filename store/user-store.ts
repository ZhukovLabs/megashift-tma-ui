import {create} from 'zustand';

export type User = {
    name: string;
    surname: string;
}

type UserState = {
    user: User | null;
    setUser: (user: User) => void;
    resetUser: VoidFunction;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    resetUser: () => set({user: null}),
}));

import {create} from 'zustand';

type UserState = {
    selectedShiftId: string | null;
    setSelectedShiftId: (id: string | null) => void;
}

export const useScheduleStore = create<UserState>((set) => ({
    selectedShiftId: null,
    setSelectedShiftId: (shiftId) => set({selectedShiftId: shiftId}),
}));

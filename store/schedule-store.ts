import {create} from 'zustand';

type UserState = {
    selectedShiftId: string | null;
    setSelectedShiftId: (id: string | null) => void;
    setEditIsOpen: (isOpen: boolean) => void;
    editIsOpen: boolean;
}

export const useScheduleStore = create<UserState>((set) => ({
    selectedShiftId: null,
    editIsOpen: false,

    setSelectedShiftId: (shiftId) => set({selectedShiftId: shiftId}),
    setEditIsOpen: (isOpen) => set({editIsOpen: isOpen}),
}));

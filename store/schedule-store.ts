import {create} from 'zustand';

type UserState = {
    selectedShiftId: string | null;
    editIsOpen: boolean;

    setSelectedShiftId: (id: string | null) => void;
    setEditIsOpen: (isOpen: boolean) => void;
}

export const useScheduleStore = create<UserState>((set) => ({
    selectedShiftId: null,
    editIsOpen: false,

    setSelectedShiftId: (shiftId) => set({selectedShiftId: shiftId}),
    setEditIsOpen: (isOpen) => set({editIsOpen: isOpen}),
}));

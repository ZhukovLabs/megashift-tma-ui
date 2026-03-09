export type ShiftDto = {
    id: string;
    date: string;
    actualStartTime: string | null;
    actualEndTime: string | null;
    shiftTemplateId: string | null;
};

export type CreateShiftPayload = {
    date: string;
    actualStartTime?: string;
    actualEndTime?: string;
    shiftTemplateId?: string;
    ownerId?: string;
};

export type UpdateShiftPayload = {
    id: string;
    date?: string;
    actualStartTime?: string;
    actualEndTime?: string;
    shiftTemplateId?: string;
    ownerId?: string;
};

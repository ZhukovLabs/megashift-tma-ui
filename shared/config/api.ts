export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const ENDPOINTS = {
    checkRegistration: '/users/check-registration',
    register: '/users/register',

    createShift: '/shifts',
    getShiftsByMonth: '/shifts/by-month',
    getShiftsByDate: '/shifts/by-date',
    updateShift: (shiftId: string) => `/shifts/${shiftId}`,
    deleteShift: (shiftId: string) => `/shifts/${shiftId}`,

    createShiftTemplates: '/shift-templates',
    getShiftTemplateById: (shiftTemplateId: string) => `/shift-templates/${shiftTemplateId}`,
    getShiftTemplates: '/shift-templates',
    updateShiftTemplate: (shiftTemplateId: string) => `/shift-templates/${shiftTemplateId}`,
    deleteShiftTemplate: (shiftTemplateId: string) => `/shift-templates/${shiftTemplateId}`,

    grantClaim: '/users/access/grant',
    getGrantedUsers: "/users/access/granted-users",
    updateUserClaims: "/users/access/update",
    revokeAllRights: (userId: string) => `/users/access/${userId}`,

    getAvailableCalendars: '/users/access/available-calendars',
    unsubscribeFromCalendar: (ownerId: string) => `/users/access/unsubscribe/${ownerId}`,

    createInvite: '/users/invite',
    checkInvite: (inviteId: string) => `/users/invite/${inviteId}`,
    consumeInvite: (inviteId: string) => `/users/invite/${inviteId}/consume`,

    getProfile: '/profile',
    updateProfile: '/profile',

    getSettings: '/settings',
    updateSalary: '/settings/salary',

    getSalaryStatistic: '/statistics/salary',
    getShiftStatisticCount: '/statistics/shifts',
    getShiftStatisticHours: '/statistics/shifts/hours',
    getStatisticsCombined: '/statistics/combined'
} as const;
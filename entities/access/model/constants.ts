import { AccessClaim } from './types';

export const ACCESS_CLAIM_LABELS: Record<keyof typeof AccessClaim, string> = {
    READ: 'Чтение',
    EDIT_SELF: 'Редактирование своих данных',
    DELETE_SELF: 'Удаление своих данных',
    EDIT_ALL: 'Редактирование данных всех',
    DELETE_ALL: 'Удаление данных всех',
    READ_STATISTICS: 'Просмотр статистики',
};

// i18n keys for access claims - use with t('accessClaims.READ') etc.
export const ACCESS_CLAIM_KEYS: Record<keyof typeof AccessClaim, string> = {
    READ: 'accessClaims.READ',
    EDIT_SELF: 'accessClaims.EDIT_SELF',
    DELETE_SELF: 'accessClaims.DELETE_SELF',
    EDIT_ALL: 'accessClaims.EDIT_ALL',
    DELETE_ALL: 'accessClaims.DELETE_ALL',
    READ_STATISTICS: 'accessClaims.READ_STATISTICS',
};

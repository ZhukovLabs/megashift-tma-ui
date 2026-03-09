import { AccessClaim } from '@/entities/access';

export type AccessUser = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string | null;
    claims: AccessClaim[];
};

export type GrantOrUpdateAccessDto = {
    targetUserId: string;
    claims: AccessClaim[];
};

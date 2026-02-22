import {AccessClaim} from "@/constants/access-claim";

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
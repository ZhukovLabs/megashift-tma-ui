import {AccessClaim} from "@/types";

export const ACCESS_CLAIM_LABELS: Record<keyof typeof AccessClaim, string> = {
    READ: "Чтение",
    EDIT_SELF: "Редактирование своих данных",
    DELETE_SELF: "Удаление своих данных",
    EDIT_ALL: "Редактирование данных всех",
    DELETE_ALL: "Удаление данных всех",
    READ_STATISTICS: "Просмотр статистики",
};
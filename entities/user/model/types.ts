import {Currency} from "@/entities/currency";

export type User = {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    timezone: string;
    currency?: Currency
};
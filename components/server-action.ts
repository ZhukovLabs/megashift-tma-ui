'use server';

import {isValid} from '@tma.js/init-data-node'

export const serverAction = async (rawData: string) => {
    return isValid(rawData, process.env.BOT_TOKEN!);
}
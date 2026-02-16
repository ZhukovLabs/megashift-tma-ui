import {telegramInit} from '@/utils/telegram-init';
import {mockEnv} from '@/mocks/mock-env';

mockEnv().then(() => {
    try {
        telegramInit({debug: true});
    } catch (e) {
        console.log(e);
    }
});

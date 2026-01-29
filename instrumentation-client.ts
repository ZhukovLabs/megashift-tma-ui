import {init} from '@/telegram/init';
import {mockEnv} from '@/mocks/mock-env';

mockEnv().then(() => {
    try {
        init({debug: true});
    } catch (e) {
        console.log(e);
    }
});

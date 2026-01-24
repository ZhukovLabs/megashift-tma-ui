import {retrieveLaunchParams} from '@tma.js/sdk-react';
import {init} from '@/telegram/init';
import {mockEnv} from '@/mocks/mock-env';

mockEnv().then(() => {
    try {
        const launchParams = retrieveLaunchParams();
        const debug =
            (launchParams.tgWebAppStartParam || '').includes('debug') ||
            process.env.NODE_ENV === 'development';

        init({debug});
    } catch (e) {
        console.log(e);
    }
});

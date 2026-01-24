import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import React from 'react';

import {timeZone} from './config';

export const I18nProvider = async ({children}: React.PropsWithChildren) => {
    const messages = await getMessages();
    return (
        <NextIntlClientProvider messages={messages} timeZone={timeZone}>
            {children}
        </NextIntlClientProvider>
    );
};

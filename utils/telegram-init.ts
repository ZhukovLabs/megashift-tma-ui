import {
    setDebug,
    init as initSDK,
    miniApp,
    viewport,
    swipeBehavior,
    closingBehavior
} from '@tma.js/sdk-react';

export interface InitOptions {
    debug?: boolean;
}

export const telegramInit = (options: InitOptions = {}) => {
    const {debug = false} = options;

    setDebug(debug);

    initSDK();


    mountSafely(miniApp, 'miniApp.mount');

    mountSafely(closingBehavior, 'closingBehavior.mount', () => {
        closingBehavior.enableConfirmation();
    });

    mountSafely(viewport, 'viewport.mount', () => {
        viewport.bindCssVars();
        viewport.expand();
        viewport.requestFullscreen();
    });

    setTimeout(() => {
        try {
            viewport.expand();
            viewport.requestFullscreen();
        } catch (err) {
            console.warn('[TMA] delayed expand & fullscreen failed', err);
        }
    }, 300);

    mountSafely(swipeBehavior, 'swipeBehavior.mount', () => {
        swipeBehavior.disableVertical();
    });
};


function mountSafely(
    component: { mount?: () => void; },
    label: string,
    afterMount?: () => void,
) {
    if (!component?.mount) return;

    try {
        component.mount();
        afterMount?.();
    } catch (err) {
        console.warn(`[TMA] ${label} failed`, err);
    }
}
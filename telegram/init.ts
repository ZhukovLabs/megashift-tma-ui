import {
    setDebug,
    init as initSDK,
    miniApp,
    viewport,
    swipeBehavior,
} from '@tma.js/sdk-react';

export interface InitOptions {
    debug?: boolean;
}

export const init=(options: InitOptions = {})=> {
    const {debug = false} = options;
    setDebug(debug);

    initSDK();

    try {
        miniApp.mount();
    } catch (err) {
        console.warn('[TMA] miniApp.mount failed', err);
    }

    try {
        viewport.expand();
    } catch (err) {
        console.warn('[TMA] viewport.expand failed', err);
    }

    try {
        viewport.requestFullscreen();
    } catch {
    }

    try {
        swipeBehavior.mount();
        swipeBehavior.disableVertical();
    } catch (err) {
        console.warn('[TMA] swipeBehavior disable failed', err);
    }

    try {
        await viewport.mount();
        viewport.bindCssVars();
    } catch (err) {
        console.warn('[TMA] viewport mount failed', err);
    }

    setTimeout(() => {
        try {
            viewport.expand();
            viewport.requestFullscreen();
        } catch {
        }
    }, 300);
}
import {
    setDebug,
    backButton,
    initData,
    init as initSDK,
    miniApp,
    viewport,
    themeParams,
} from '@tma.js/sdk-react';


export async function init(options: {
    debug: boolean
}): Promise<void> {
    setDebug(options.debug);
    initSDK();
    backButton.mount();

    try {
        miniApp.mount();
        viewport.requestFullscreen();
        themeParams.bindCssVars();
    } catch (e) {
        // miniApp not available
    }

    try {
        viewport.mount().then(() => {
            viewport.bindCssVars();
        });
    } catch (e) {
        // viewport not available
    }
}

import {mockTelegramEnv, emitEvent} from '@tma.js/sdk-react';

const themeParams = {
    accent_text_color: '#6ab2f2',
    bg_color: '#17212b',
    button_color: '#5288c1',
    button_text_color: '#ffffff',
    destructive_text_color: '#ec3942',
    header_bg_color: '#17212b',
    hint_color: '#708499',
    link_color: '#6ab3f3',
    secondary_bg_color: '#232e3c',
    section_bg_color: '#17212b',
    section_header_text_color: '#6ab3f3',
    subtitle_text_color: '#708499',
    text_color: '#f5f5f5',
} as const;

const noInsets = {left: 0, top: 46, bottom: 0, right: 0} as const;

function createMockLaunchParams() {
    return new URLSearchParams([
        ['tgWebAppThemeParams', JSON.stringify(themeParams)],
        ['tgWebAppData', new URLSearchParams([
            ['auth_date', ((Date.now() / 1000) | 0).toString()],
            ['hash', 'some-hash'],
            ['signature', 'some-signature'],
            ['user', JSON.stringify({
                first_name: 'Denis',
                id: 1160368886,
                last_name: 'Zhukov',
                photo_url: 'https://t.me/i/userpic/320/pIgDdBcvL0ik_M-UrvDiZCtYWx1En2v5aFu3KTpzzDc.svg',
                username: 'Denis_Zhukov_Hachiko',
            })],
        ]).toString()],
        ['tgWebAppVersion', '8.4'],
        ['tgWebAppPlatform', 'tdesktop'],
    ]);
}

function isRunningInTelegram(): boolean {
    if (typeof window === 'undefined') return false;

    const url = window.location.href;
    if (url.includes('tgWebAppData') || url.includes('tgWebAppPlatform')) {
        return true;
    }

    try {
        const stored = localStorage.getItem('telegram-apps/launch-params');
        if (stored) return true;
    } catch {
        // ignore
    }

    return false;
}

export function mockEnv() {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    if (isRunningInTelegram()) {
        return;
    }

    mockTelegramEnv({
        onEvent(e, next) {
            if (e.name === 'web_app_request_theme') {
                return emitEvent('theme_changed', {theme_params: themeParams});
            }
            if (e.name === 'web_app_request_viewport') {
                return emitEvent('viewport_changed', {
                    height: window.innerHeight,
                    width: window.innerWidth,
                    is_expanded: true,
                    is_state_stable: true,
                });
            }
            if (e.name === 'web_app_request_content_safe_area') {
                return emitEvent('content_safe_area_changed', noInsets);
            }
            if (e.name === 'web_app_request_safe_area') {
                return emitEvent('safe_area_changed', noInsets);
            }
            if (e.name === 'web_app_open_popup') {
                const params = e.params as {
                    title?: string;
                    message?: string;
                    buttons?: { type: string; id?: string }[]
                };

                const result = window.confirm(`${params.title ?? ''}\n\n${params.message ?? ''}`);

                const buttonId = result
                    ? params.buttons?.find(b => b.type !== 'cancel')?.id
                    : params.buttons?.find(b => b.type === 'cancel')?.id;

                emitEvent('popup_closed', {
                    button_id: buttonId ?? undefined,
                });

                return;
            }
            if (e.name === 'web_app_open_tg_link') {
                const params = e.params as { path_full: string };

                const url = new URL(params.path_full, 'https://t.me');
                const targetUrl = url.searchParams.get('url');

                if (targetUrl) {
                    const targetUrlObj = new URL(targetUrl);
                    const queryParams = targetUrlObj.search.substring(1);

                    const localUrl = `http://localhost:3000?${queryParams}`;

                    alert('CONSOLE: ' + localUrl);
                    console.log('[SHARE URL]:', localUrl);
                }

                return;
            }

            next();
        },
        launchParams: createMockLaunchParams(),
    });

    console.info(
        '⚠️ Telegram environment mocked for development. This will not happen in production.',
    );
}

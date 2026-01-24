'use client';

import {useLaunchParams, useAndroidDeviceData, useRawInitData, viewport, useSignal} from '@tma.js/sdk-react';
import {useLayoutEffect} from "react";
import {useMessages} from "next-intl";

export const Welcome = () => {
    const launchParams = useLaunchParams();
    const androidDeviceData = useAndroidDeviceData();
    const rawInitData = useRawInitData();
    const messages = useMessages();

    useLayoutEffect(() => {
        (async () => {
            await viewport.mount();
        })();
    }, []);

    const {tgWebAppData} = launchParams;
    const marginTop = useSignal(viewport.contentSafeAreaInsetTop);

    if (!tgWebAppData || !tgWebAppData.user) return null;

    const {first_name, last_name, username, photo_url} = tgWebAppData.user;


    return <div>
        <div style={{marginTop: marginTop}}></div>
        <h1>{messages.welcome}, {first_name} {last_name}</h1>
        <p style={{fontSize: '8px'}}>@{username}</p>

        <img src={photo_url} alt="avatar"/>

        <p>RawInitData:</p>
        <code>{rawInitData}</code>
    </div>
}
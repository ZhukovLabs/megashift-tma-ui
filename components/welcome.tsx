'use client';

import {useLaunchParams, useAndroidDeviceData, useRawInitData, viewport, useSignal} from '@tma.js/sdk-react';
import {useLayoutEffect} from "react";

export const Welcome = () => {
    const launchParams = useLaunchParams();
    const androidDeviceData = useAndroidDeviceData();
    const rawInitData = useRawInitData();

    useLayoutEffect(() => {
        (async () => {
            await viewport.mount();
        })();
    }, []);

    const {tgWebAppData} = launchParams;
    const marginTop = useSignal(viewport.contentSafeAreaInsetTop);

    if (!tgWebAppData || !tgWebAppData.user) return null;

    const {first_name, last_name, username, photo_url} = tgWebAppData.user;
    const {model, manufacturer} = androidDeviceData;


    return <div>
        <div style={{marginTop: marginTop}}></div>
        <h1>Welcome, {first_name} {last_name}</h1>
        <p style={{fontSize: '8px'}}>@{username}</p>

        <img src={photo_url} alt="avatar"/>

        <h2>You enter from {manufacturer} {model}</h2>

        <p>RawInitData:</p>
        <code>{rawInitData}</code>
    </div>
}
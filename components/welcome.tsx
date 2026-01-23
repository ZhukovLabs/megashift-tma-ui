'use client';

import {useLaunchParams, useAndroidDeviceData, useRawInitData} from '@tma.js/sdk-react';

export const Welcome = () => {
    const launchParams = useLaunchParams();
    const androidDeviceData = useAndroidDeviceData();
    const rawInitData = useRawInitData();

    const {tgWebAppData} = launchParams;

    if (!tgWebAppData || !tgWebAppData.user) return null;

    const {first_name, last_name, username} = tgWebAppData.user;
    const {model, manufacturer} = androidDeviceData;

    return <div>
        <h1>Welcome, {first_name} {last_name}</h1>
        <p style={{fontSize: '8px'}}>@{username}</p>

        <h2>You enter from {manufacturer} {model}</h2>

        <p>RawInitData:</p>
        <code>{rawInitData}</code>
    </div>
}
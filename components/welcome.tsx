'use client';

import {useLaunchParams, useRawInitData} from '@tma.js/sdk-react';
import {useMessages} from "next-intl";
import {useEffect, useState} from "react";
import {serverAction} from "@/components/server-action";
import {Avatar, Blockquote} from "@telegram-apps/telegram-ui";

export const Welcome = () => {
    const launchParams = useLaunchParams();
    const rawInitData = useRawInitData();
    const messages = useMessages();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (rawInitData) {
            serverAction(rawInitData).then(data => setIsValid(data));
        }
    }, [rawInitData]);

    const {tgWebAppData} = launchParams;

    if (!tgWebAppData || !tgWebAppData.user) return null;

    const {first_name, last_name, username, photo_url} = tgWebAppData.user;


    return <div>
        <h1>{messages.welcome}, {first_name} {last_name}</h1>
        <p style={{fontSize: '8px'}}>@{username}</p>

        <Avatar src={photo_url} alt="avatar"/>

        <Blockquote type="text">
            Auth is valid: {JSON.stringify(isValid)}
        </Blockquote>
    </div>
}
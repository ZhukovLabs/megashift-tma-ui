import {Avatar, Button, Card, Subheadline, Text, Title} from "@telegram-apps/telegram-ui";
import type {StepProps} from "../types";
import {useTranslations} from "next-intl";
import {useLaunchParams} from "@tma.js/sdk-react";

export const WelcomeStep = ({onNext}: StepProps) => {
    const {
        tgWebAppData: {
            user: {firstName, photoUrl} = {}
        } = {}
    } = useLaunchParams(true);
    const t = useTranslations("start-form.welcome-step");

    return (
        <Card className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-tg-accent-color rounded-full flex items-center justify-center">
                    <Avatar src={photoUrl} alt="user"/>
                </div>

                <Title level="2" className="flex items-center">
                    {t("title")}, {firstName ?? t('user')}!
                </Title>

                <Subheadline className="text-tg-hint-color">
                    {t("subtitle")}
                </Subheadline>

                <Text className="text-tg-text-color">
                    {t("description")}
                </Text>

                <div className="mt-4 w-full">
                    <Button mode="filled" size="l" onClick={onNext} className="w-full">
                        {t("next")}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

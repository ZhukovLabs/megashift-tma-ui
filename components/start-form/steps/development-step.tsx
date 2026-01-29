import { Button, Card, Title, Text } from "@telegram-apps/telegram-ui";
import type { StepProps } from "../types";
import { useTranslations } from "next-intl";
import { useLaunchParams } from "@tma.js/sdk-react";

export const DevelopmentStep = () => {
    const {
        tgWebAppData: {
            user: { firstName } = {},
        } = {},
    } = useLaunchParams(true);
    const t = useTranslations("start-form.development-step");

    return (
        <Card className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-tg-secondary-bg-color rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚧</span>
                </div>

                <Title level="2" className="text-center">
                    {firstName ? t("titleWithName", { name: firstName }) : t("title")}
                </Title>

                <div className="space-y-4">
                    <Text className="text-tg-text-color text-lg font-medium">
                        {t("status")}
                    </Text>

                    <Text className="text-tg-hint-color">
                        {t("description")}
                    </Text>

                    <div className="bg-tg-secondary-bg-color p-4 rounded-lg mt-4">
                        <Text className="text-tg-text-color">
                            {t("thankYou")}
                        </Text>
                    </div>
                </div>

                {/* Дополнительная информация, если нужно */}
                <div className="w-full border-t border-tg-secondary-bg-color pt-4">
                    <Text className="text-tg-hint-color text-sm">
                        {t("additionalInfo")}
                    </Text>
                </div>

                <div className="mt-4 w-full">
                    <Button
                        mode="filled"
                        size="l"
                        className="w-full bg-tg-accent-color hover:bg-tg-accent-color-hover"
                    >
                        {t("continue")}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
import {useTranslations} from "next-intl";
import {miniApp, useLaunchParams} from "@tma.js/sdk-react";
import {useUserStore} from "@/store/user-store";
import {StepProps} from "../types";

const ownerId = 1160368886;

export const DevelopmentStep = ({onNext}: StepProps) => {
    const t = useTranslations("start-form.development-step");

    const {
        tgWebAppData: {
            user: {firstName, id} = {},
        } = {},
    } = useLaunchParams(true);
    const user = useUserStore((s) => s.user);

    const name = user?.name ?? firstName ?? "Пользователь";

    const handleGotIt = () => {
        if (id === ownerId) {
            onNext();
        } else {
            miniApp.unmount();
            miniApp.close();
        }
    }

    return (
        <div className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-tg-secondary-bg-color rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚧</span>
                </div>

                <h2 className="text-center">
                    {firstName ? t("titleWithName", {name}) : t("title")}
                </h2>

                <div className="space-y-4">
                    <div className="text-tg-text-color text-lg font-medium">
                        {t("status")}
                    </div>
                    <br/>
                    <div className="text-tg-hint-color whitespace-pre-wrap">
                        {t("description")}
                    </div>
                    <br/>
                    <div className="bg-tg-secondary-bg-color p-4 rounded-lg mt-4">
                        <div className="text-tg-text-color">
                            {t("thankYou")}
                        </div>
                    </div>
                </div>

                <div className="w-full border-t border-tg-secondary-bg-color pt-4">
                    <div className="text-tg-hint-color text-sm">
                        {t("additionalInfo")}
                    </div>
                </div>

                <button className="btn w-full btn-accent" onClick={handleGotIt}>
                    {t("continue")}
                </button>
            </div>
        </div>
    );
};
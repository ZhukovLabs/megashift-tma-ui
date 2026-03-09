import type { StepProps } from '@/features/auth/model';
import { useTranslations } from 'next-intl';
import { useLaunchParams } from '@tma.js/sdk-react';

export const WelcomeStep = ({onNext}: StepProps) => {
    const {
        tgWebAppData: {
            user: {firstName, photoUrl} = {}
        } = {}
    } = useLaunchParams(true);
    const t = useTranslations("start-form.welcome-step");

    return (
        <div className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-tg-accent-color rounded-full flex items-center justify-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src={photoUrl} alt="user"/>
                        </div>
                    </div>
                </div>

                <h2 className="flex items-center">
                    {t("title")}, {firstName ?? t('user')}!
                </h2>

                <h3 className="text-tg-hint-color">
                    {t("subtitle")}
                </h3>

                <div className="text-tg-text-color">
                    {t("description")}
                </div>

                <div className="mt-4 w-full">
                    <button className="btn btn-primary w-full" onClick={onNext}>
                        {t("next")}
                    </button>
                </div>
            </div>
        </div>
    );
}

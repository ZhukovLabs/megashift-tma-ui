import {Button, Card, Title} from '@telegram-apps/telegram-ui';
import React from "react";
import {StepProps} from "../types";
import {Field} from "@/components/field";
import {useTranslations} from "next-intl";
import {useFormContext} from "react-hook-form";

type EnterUserInfoStepProps = StepProps & { isValid: boolean };

export const EnterUserInfoStep = ({onNext, onBack, isValid}: EnterUserInfoStepProps) => {
    const {handleSubmit} = useFormContext();
    const t = useTranslations('start-form.enter-user-info-step');

    return (
        <Card className="w-full mx-auto p-6 rounded-2xl">
            <Title level="2" className="text-tg-text-color mb-6">
                {t("title")}
            </Title>

            <form onSubmit={handleSubmit(onNext)}>
                <div className="space-y-4">
                    <Field
                        name="surname"
                        label={t('surname.label')}
                        placeholder={t('surname.placeholder')}
                        autoComplete="family-name"
                        required
                    />

                    <Field
                        name="name"
                        label={t('name.label')}
                        placeholder={t('name.placeholder')}
                        autoComplete="given-name"
                        required
                    />

                    <Field
                        name="patronymic"
                        label={t('patronymic.label')}
                        placeholder={t('patronymic.placeholder')}
                        autoComplete="additional-name"
                    />
                </div>

                <div className="flex gap-3 mt-8">
                    <Button mode="outline" size="l" onClick={onBack} className="flex-1">
                        Назад
                    </Button>
                    <Button
                        type="submit"
                        mode="filled"
                        size="l"
                        disabled={!isValid}
                        className="flex-1"
                    >
                        Продолжить
                    </Button>
                </div>
            </form>
        </Card>
    );
}

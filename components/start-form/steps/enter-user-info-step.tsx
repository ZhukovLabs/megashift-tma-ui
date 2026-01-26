import {Button, Card, Title} from '@telegram-apps/telegram-ui';
import React from "react";
import {StepProps} from "../types";
import {Field} from "../field";

export const EnterUserInfoStep = ({onNext, onBack, isValid}: StepProps & { isValid: boolean }) => (
    <Card className="w-full max-w-md mx-auto p-6 bg-tg-secondary-bg-color rounded-2xl">
        <Title level="2" className="text-tg-text-color mb-6">
            Личные данные
        </Title>

        <div className="space-y-4">
            <Field
                name="surname"
                label="Фамилия*"
                placeholder="Введите вашу фамилию"
                autoComplete="family-name"
                required
            />

            <Field
                name="name"
                label="Имя*"
                placeholder="Введите ваше имя"
                autoComplete="given-name"
                required
            />

            <Field
                name="patronymic"
                label="Отчество"
                placeholder="Введите ваше отчество (если есть)"
                autoComplete="additional-name"
            />
        </div>

        <div className="flex gap-3 mt-8">
            <Button mode="outline" size="l" onClick={onBack} className="flex-1">
                Назад
            </Button>
            <Button
                mode="filled"
                size="l"
                onClick={onNext}
                disabled={!isValid}
                className="flex-1"
            >
                Продолжить
            </Button>
        </div>
    </Card>
);

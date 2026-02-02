import React from "react";
import {StepProps, FormData} from "../types";
import {useTranslations} from "next-intl";
import {useFormContext} from "react-hook-form";

type EnterUserInfoStepProps = StepProps & { isValid: boolean };

export const EnterUserInfoStep = ({onNext, onBack, isValid}: EnterUserInfoStepProps) => {
    const {handleSubmit, formState:{errors}, register} = useFormContext<FormData>();
    const t = useTranslations('start-form.enter-user-info-step');

    return (
        <div className="w-full mx-auto p-6 rounded-2xl">
            <h2 className="mb-6">
                {t("title")}
            </h2>

            <form onSubmit={handleSubmit(onNext)} className="w-full">
                <div className="flex flex-col [&>span]:mb-5">
                    <input
                        {...register('surname')}
                        className="input w-full"
                        placeholder={t('surname.placeholder')}
                        autoComplete="family-name"
                        required
                    />
                    <span className="text-red-500 text-sm">{errors.surname?.message}</span>

                    <input
                        {...register('name')}
                        className="input w-full"
                        placeholder={t('name.placeholder')}
                        autoComplete="given-name"
                        required
                    />
                    <span className="text-red-500 text-sm">{errors.name?.message}</span>

                    <input
                        {...register('patronymic')}
                        className="input w-full"
                        placeholder={t('patronymic.placeholder')}
                        autoComplete="additional-name"
                    />
                    <span className="text-red-500 text-sm">{errors.patronymic?.message}</span>
                </div>

                <div className="flex gap-3 mt-8">
                    <button type="button" onClick={onBack} className="btn btn-outline flex-1">
                        Назад
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="btn btn-primary flex-1"
                    >
                        Продолжить
                    </button>
                </div>
            </form>
        </div>
    );
}

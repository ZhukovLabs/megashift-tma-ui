import {FormData, StepProps} from "../types";
import {useCreateUser} from "@/components/start-form/hooks/use-create-user";
import {useFormContext} from "react-hook-form";

export const ConfirmationStep = ({onNext, onBack, values}: StepProps & {
    values: FormData;
}) => {
    const {handleSubmit, formState: {isSubmitting}} = useFormContext<FormData>();
    const {mutateAsync: createUser} = useCreateUser();

    const handleClick = handleSubmit(async (data) => {
        await createUser({
            ...data,
            ...{patronymic: data.patronymic ? data.patronymic : undefined}
        });
        onNext?.();
    });

    return (
        <div className="w-full mx-auto p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-tg-success-color rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">✓</span>
                </div>

                <h2 className="text-tg-text-color">
                    Проверьте данные
                </h2>

                <div className="w-full bg-tg-bg-color rounded-xl p-4 space-y-3">
                    <DataRow label="Фамилия" value={values.surname}/>
                    <div className="divider"/>
                    <DataRow label="Имя" value={values.name}/>
                    <div className="divider"/>
                    <DataRow label="Отчество" value={values.patronymic}/>
                </div>

                <div className="text-tg-hint-color text-sm">
                    Если всё верно, нажмите «Отправить». Или вернитесь назад для редактирования.
                </div>

                <div className="flex gap-3 w-full mt-4">
                    <button onClick={onBack} className="btn btn-outline flex-1">
                        Назад
                    </button>
                    <button
                        type="submit"
                        onClick={handleClick}
                        disabled={isSubmitting}
                        className="btn btn-primary flex-1"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DataRow = ({label, value}: { label: string; value?: string }) => (
    <div className="flex justify-between">
        <div className="text-tg-hint-color">{label}:</div>
        <div className="text-tg-text-color font-medium">
            {value || 'Не указано'}
        </div>
    </div>
);
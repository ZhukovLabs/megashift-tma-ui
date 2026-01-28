import {Button, Card, Divider, Text, Title} from "@telegram-apps/telegram-ui";
import {FormData, StepProps} from "../types";

export const ConfirmationStep = ({onNext, onBack, isSubmitting, values}: StepProps & {
    values: FormData;
}) => (
    <Card className="w-full mx-auto p-6 rounded-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-tg-success-color rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">✓</span>
            </div>

            <Title level="2" className="text-tg-text-color">
                Проверьте данные
            </Title>

            <div className="w-full bg-tg-bg-color rounded-xl p-4 space-y-3">
                <DataRow label="Фамилия" value={values.surname}/>
                <Divider/>
                <DataRow label="Имя" value={values.name}/>
                <Divider/>
                <DataRow label="Отчество" value={values.patronymic}/>
            </div>

            <Text className="text-tg-hint-color text-sm">
                Если всё верно, нажмите «Отправить». Или вернитесь назад для редактирования.
            </Text>

            <div className="flex gap-3 w-full mt-4">
                <Button mode="outline" size="l" onClick={onBack} className="flex-1">
                    Назад
                </Button>
                <Button
                    mode="filled"
                    size="l"
                    onClick={onNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-tg-accent-color"
                >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </Button>
            </div>
        </div>
    </Card>
);

const DataRow = ({label, value}: { label: string; value?: string }) => (
    <div className="flex justify-between">
        <Text className="text-tg-hint-color">{label}:</Text>
        <Text className="text-tg-text-color font-medium">
            {value || 'Не указано'}
        </Text>
    </div>
);
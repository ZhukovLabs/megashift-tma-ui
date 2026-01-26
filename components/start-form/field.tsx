import {FormData} from "./types";
import {Controller, useFormContext} from "react-hook-form";
import {Input, Text} from "@telegram-apps/telegram-ui";
import React from "react";

type FieldProps = {
    name: keyof FormData;
    label: string;
    placeholder: string;
    autoComplete?: string;
    required?: boolean;
};

export const Field = ({ name, label, placeholder, autoComplete, required }: FieldProps) => {
    const { control, formState: { errors } } = useFormContext<FormData>();

    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        required={required}
                        header={label}
                        placeholder={placeholder}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        status={errors[name] ? 'error' : 'default'}
                        className="w-full"
                        autoComplete={autoComplete}
                    />
                )}
            />
            {errors[name] && (
                <Text className="text-tg-error-color text-sm mt-1">
                    {errors[name]?.message}
                </Text>
            )}
        </div>
    );
};

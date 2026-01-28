import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { Input, Text } from "@telegram-apps/telegram-ui";
import cn from "classnames";
import React from "react";

type FieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    placeholder: string;
    autoComplete?: string;
    required?: boolean;
};

const baseWrapperClass =
    "[&>div]:!bg-transparent [&>div>h6]:shadow-[0_0_0_2px_var(--tgui--outline)]";

const errorWrapperClass =
    "[&>div>h6]:!shadow-[0_0_0_2px_var(--tgui--destructive_text_color)]";

export const Field = <T extends FieldValues>({
                                                 name,
                                                 label,
                                                 placeholder,
                                                 autoComplete,
                                                 required,
                                             }: FieldProps<T>) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<T>();

    const error = errors[name];

    return (
        <div className={cn(baseWrapperClass, { [errorWrapperClass]: error })}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        required={required}
                        header={label}
                        placeholder={placeholder}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={() => field.onBlur()}
                        status={error ? "error" : "default"}
                        className="w-full bg-white sh"
                        autoComplete={autoComplete}
                    />
                )}
            />

            {error && (
                <Text
                    Component={() => (
                        <span className="text-red-500 text-sm mt-1 w-full">
                            {String(error.message)}
                        </span>
                    )}
                    className="text-red-500 text-sm mt-1"
                />
            )}
        </div>
    );
};

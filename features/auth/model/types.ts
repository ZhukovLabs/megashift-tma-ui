import {z} from "zod";
import {formSchema} from "./schema";

export type StepProps = {
    onNext?: VoidFunction;
    onBack?: VoidFunction;
};

export type FormData = z.infer<typeof formSchema>;

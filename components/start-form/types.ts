import {z} from "zod";
import {formSchema} from "./schema";

export type StepProps = {
    onNext: VoidFunction;
    onBack?: VoidFunction;
    isSubmitting?: boolean;
};

export type FormData = z.infer<typeof formSchema>;
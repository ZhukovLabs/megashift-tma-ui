import {Plus} from "lucide-react";

export const EmptyState = ({onCreateClick}: { onCreateClick?: VoidFunction }) => {
    return (
        <div className="flex flex-col items-center gap-4 py-10">
            <p className="px-4 text-center text-base-content/60">
                Сейчас смен нет — добавьте первую смену!
            </p>

            <button
                onClick={onCreateClick}
                aria-label="Добавить смену"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content shadow-md transition hover:shadow-lg"
            >
                <Plus size={24} strokeWidth={2}/>
            </button>
        </div>
    );
}

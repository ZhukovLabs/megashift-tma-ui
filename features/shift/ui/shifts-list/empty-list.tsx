import {Plus, ClipboardList} from "lucide-react";
import {motion} from "framer-motion";

export const EmptyState = ({onCreateClick}: { onCreateClick?: VoidFunction }) => {
    return (
        <motion.div 
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            className="flex flex-col items-center justify-center gap-6 py-20 px-6 bg-base-200/20 rounded-[40px] border-2 border-dashed border-base-300/50 mt-4"
        >
            <div className="w-20 h-20 rounded-[30px] bg-primary/10 flex items-center justify-center text-primary/40 relative">
                <ClipboardList size={40} strokeWidth={1.5} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-base-100 flex items-center justify-center shadow-lg text-primary">
                    <Plus size={16} strokeWidth={3} />
                </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
                <h3 className="text-xl font-black text-base-content/80">Смен пока нет</h3>
                <p className="text-center text-sm font-medium text-base-content/40 max-w-[220px] leading-relaxed">
                    Создайте свой первый шаблон смены, чтобы планировать график
                </p>
            </div>

            <button
                onClick={onCreateClick}
                className="btn btn-primary btn-wide rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 h-14"
            >
                Добавить смену
            </button>
        </motion.div>
    );
}

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <motion.div
                className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Icon className="w-8 h-8 text-zinc-600" />
            </motion.div>

            <motion.h3
                className="text-lg font-semibold text-zinc-300 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {title}
            </motion.h3>

            <motion.p
                className="text-sm text-zinc-600 mt-1 max-w-[240px] text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {description}
            </motion.p>

            {action && (
                <motion.button
                    className="mt-6 px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-full text-sm hover:bg-yellow-300 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={action.onClick}
                >
                    {action.label}
                </motion.button>
            )}
        </div>
    );
}

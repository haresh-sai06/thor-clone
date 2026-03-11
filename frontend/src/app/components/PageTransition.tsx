import { motion } from "motion/react";
import { touristTransition, enterpriseTransition } from "../../../motion/variants";
import type { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
    type?: "tourist" | "enterprise";
}

export default function PageTransition({ children, type = "tourist" }: PageTransitionProps) {
    const variants = type === "tourist" ? touristTransition : enterpriseTransition;

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="h-full w-full"
        >
            {children}
        </motion.div>
    );
}

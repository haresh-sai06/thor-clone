import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 200),   // Zap icon
            setTimeout(() => setPhase(2), 600),   // THOR text
            setTimeout(() => setPhase(3), 900),   // Tagline
            setTimeout(() => setPhase(4), 1200),  // Yellow line
            setTimeout(() => setPhase(5), 1600),  // Glow pulse
            setTimeout(() => setPhase(6), 2400),  // Fade out
            setTimeout(() => onComplete(), 2800), // Done
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const thorLetters = "THOR".split("");

    return (
        <AnimatePresence>
            {phase < 6 && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Ambient glow behind logo */}
                        {phase >= 5 && (
                            <motion.div
                                className="absolute w-64 h-64 rounded-full pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)",
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.4] }}
                                transition={{ duration: 1 }}
                            />
                        )}

                        {/* Zap Icon */}
                        {phase >= 1 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <Zap className="w-16 h-16 text-yellow-400" fill="currentColor" />
                            </motion.div>
                        )}

                        {/* THOR Text */}
                        {phase >= 2 && (
                            <div className="flex mt-4">
                                {thorLetters.map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        className="text-7xl font-black text-white"
                                        style={{ letterSpacing: "-0.02em" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06, duration: 0.3 }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                        )}

                        {/* Yellow line sweep */}
                        {phase >= 4 && (
                            <motion.div
                                className="h-0.5 bg-yellow-400 mt-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        )}

                        {/* Tagline */}
                        {phase >= 3 && (
                            <motion.p
                                className="text-sm tracking-[0.3em] uppercase text-zinc-400 mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                Your Guardian in Every Journey
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

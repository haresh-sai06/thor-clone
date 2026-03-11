import { Outlet } from "react-router";
import { Zap, Shield, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "../../motion/variants";

const features = [
    { icon: Shield, title: "Real-time Safety Zones", desc: "AI-monitored danger areas with live alerts" },
    { icon: MapPin, title: "Offline Navigation", desc: "Navigate safely even without internet" },
    { icon: Phone, title: "1-Tap SOS", desc: "Instant emergency broadcast to all contacts" },
];

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex bg-black">
            {/* Left — Cinematic brand panel */}
            <div className="hidden lg:flex flex-col justify-center items-center w-[480px] flex-shrink-0 relative overflow-hidden bg-zinc-950">
                {/* Vertical yellow accent line */}
                <div className="absolute left-0 top-0 w-0.5 h-full bg-yellow-400" />

                {/* Animated world map SVG outline */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <motion.svg
                        viewBox="0 0 800 400"
                        className="w-full h-auto"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                    >
                        <motion.ellipse
                            cx="400" cy="200" rx="350" ry="170"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                        <motion.ellipse
                            cx="400" cy="200" rx="250" ry="120"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
                        />
                        <motion.path
                            d="M100,200 Q200,100 300,180 T500,160 Q600,140 700,200"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                        />
                        <motion.path
                            d="M150,250 Q250,300 400,260 T650,280"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut", delay: 0.7 }}
                        />
                        {/* Grid lines for globe feel */}
                        <motion.line x1="400" y1="30" x2="400" y2="370"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 1 }}
                        />
                        <motion.line x1="50" y1="200" x2="750" y2="200"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 1.2 }}
                        />
                    </motion.svg>
                </div>

                {/* Feature cards */}
                <motion.div
                    className="relative z-10 px-12 space-y-4 mb-12"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                className="glass-panel rounded-xl px-5 py-4 flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">{feat.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom: THOR branding */}
                <div className="relative z-10 text-center mt-auto pb-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-8 h-8 text-yellow-400" fill="currentColor" />
                        <span className="text-3xl font-black text-white tracking-tight">THOR</span>
                    </div>
                    <p className="text-xs tracking-[0.2em] uppercase text-zinc-500">Guard of Tourism</p>
                </div>
            </div>

            {/* Right — Form area */}
            <div className="flex-1 flex flex-col bg-black">
                {/* Mobile-only THOR wordmark */}
                <div className="lg:hidden flex items-center gap-2 px-6 pt-8 pb-4">
                    <Zap className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    <span className="text-lg font-bold text-white">THOR</span>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

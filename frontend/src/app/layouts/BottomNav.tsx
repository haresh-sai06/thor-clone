import { NavLink, useNavigate, useLocation } from "react-router";
import { Home, Map, Users, MessageSquare, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "Map", icon: Map, path: "/map" },
    { label: "SOS", icon: AlertTriangle, path: "/emergency", isFab: true },
    { label: "Community", icon: Users, path: "/community" },
    { label: "AI Chat", icon: MessageSquare, path: "/chat" },
];

export default function BottomNav() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ maxWidth: "600px", margin: "0 auto" }}
        >
            <div
                className="relative flex items-end justify-around px-2 pb-6 pt-2 border-t"
                style={{
                    background: "rgba(10,10,10,0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderColor: "var(--thor-border)",
                }}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    // Center FAB — Emergency button
                    if (item.isFab) {
                        return (
                            <div key={item.label} className="flex flex-col items-center -mt-7">
                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => navigate("/emergency")}
                                    className="relative w-14 h-14 rounded-full bg-red-600 flex items-center justify-center"
                                    style={{
                                        boxShadow: "0 4px 24px rgba(239,68,68,0.5)",
                                    }}
                                >
                                    {/* Pulse ring */}
                                    <span className="absolute inset-0 rounded-full border border-red-500/30 animate-sos-pulse" />
                                    <Icon className="w-7 h-7 text-white" />
                                </motion.button>
                                <span className="text-[10px] font-bold uppercase tracking-wider mt-1.5 text-red-400">
                                    SOS
                                </span>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className="flex flex-col items-center justify-center min-w-[56px] relative py-1"
                        >
                            {/* Active pill indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -top-1 w-1 h-1 rounded-full bg-yellow-400"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            <motion.div
                                whileTap={{ scale: 0.88 }}
                                className="flex flex-col items-center"
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${isActive ? "text-yellow-400" : "text-zinc-600"
                                        }`}
                                />
                                <span
                                    className={`text-[10px] mt-1 font-medium tracking-wider transition-colors ${isActive ? "text-yellow-400" : "text-zinc-600"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </motion.div>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}

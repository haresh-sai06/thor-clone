import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, ChevronDown, ChevronLeft, Settings, Zap, Moon, Sun, Heart, AlertTriangle, Shield, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Map of routes to page titles
const pageTitles: Record<string, string> = {
    "/planner": "Trip Planner",
    "/planner/active": "Active Journey",
    "/planner/navigate": "Navigation",
    "/concierge": "AI Concierge",
    "/chat": "AI Chat",
    "/voice": "Voice AI",
    "/emergency": "Emergency",
    "/profile": "Profile",
    "/settings": "Settings",
};

// Top-level routes that show the THOR wordmark
const topLevelRoutes = ["/dashboard", "/map", "/community"];

export default function TopBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    // Notification states (sync with ActiveJourney)
    const [showPulse, setShowPulse] = useState(false);
    const [lastPulse, setLastPulse] = useState<string>(() => {
        const lastStr = localStorage.getItem("thor_last_pulse_check");
        if (lastStr) {
            return new Date(parseInt(lastStr, 10)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return "Not yet";
    });
    const [aiPrediction, setAiPrediction] = useState<any>(null);
    const [hasActiveJourney, setHasActiveJourney] = useState(false);
    const [destination, setDestination] = useState<string>("");
    const [stopsCount, setStopsCount] = useState<number>(0);

    const isTopLevel = topLevelRoutes.includes(location.pathname);
    const pageTitle = pageTitles[location.pathname] || "";

    // Scroll behavior
    useEffect(() => {
        const main = document.querySelector("main");
        if (!main) return;
        const handleScroll = () => setScrolled(main.scrollTop > 10);
        main.addEventListener("scroll", handleScroll);
        return () => main.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setShowNotifications(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Background 30-minute Safety Pulse
    useEffect(() => {
        const PULSE_INTERVAL = 30 * 60 * 1000;
        const checkPulse = () => {
            const lastStr = localStorage.getItem("thor_last_pulse_check");
            const last = lastStr ? parseInt(lastStr, 10) : 0;
            if (Date.now() - last >= PULSE_INTERVAL) setShowPulse(true);
        };
        checkPulse();
        const interval = setInterval(checkPulse, 60000);
        return () => clearInterval(interval);
    }, []);

    // Sync with ActiveJourney data
    useEffect(() => {
        const saved = localStorage.getItem("thor_active_plan");
        if (saved) {
            const plan = JSON.parse(saved);
            setHasActiveJourney(true);
            setDestination(plan.destination || "");
            let stops = 0;
            if (plan.hotel_recommendation) stops++;
            (plan.days || []).forEach((day: any) => {
                if (day.breakfast?.name) stops++;
                stops += (day.route_spots || []).length;
                if (day.lunch?.name) stops++;
                if (day.dinner?.name) stops++;
            });
            setStopsCount(stops);
        } else {
            setHasActiveJourney(false);
            setDestination("");
            setStopsCount(0);
        }
    }, []);

    // Listen for AI prediction updates
    useEffect(() => {
        const handleStorageChange = () => {
            const prediction = localStorage.getItem('thor_ai_prediction');
            if (prediction) {
                try {
                    setAiPrediction(JSON.parse(prediction));
                } catch (e) {
                    console.error('Failed to parse AI prediction:', e);
                }
            }
        };
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handlePulseConfirm = () => {
        setShowPulse(false);
        const now = Date.now();
        localStorage.setItem("thor_last_pulse_check", now.toString());
        setLastPulse(new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setShowNotifications(false);
    };

    const hasNotifications = showPulse || (aiPrediction?.status && aiPrediction.status !== "Proceed");

    return (
        <motion.header
            className="mx-4 mt-4 mb-1 rounded-2xl flex items-center justify-between px-4 flex-shrink-0 relative z-20 transition-all duration-300"
            style={{
                height: "56px",
                background: scrolled ? "rgba(0,0,0,0.8)" : "var(--thor-surface)",
                border: `1px solid ${scrolled ? "var(--thor-border)" : "transparent"}`,
                backdropFilter: scrolled ? "blur(20px)" : "none",
            }}
        >
            {/* Left: Logo or Back button */}
            <div className="flex items-center gap-2">
                {isTopLevel ? (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <Zap className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <span className="text-lg font-bold text-white tracking-tight">THOR</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(-1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-zinc-400" />
                        </motion.button>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={location.pathname}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.25 }}
                                className="font-semibold text-white text-sm"
                            >
                                {pageTitle}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Right: Icon cluster */}
            <div className="flex items-center gap-1">
                {/* Theme Toggle */}
                <motion.button
                    onClick={toggleTheme}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-zinc-800 text-zinc-400"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: 90, scale: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-zinc-800 text-zinc-400"
                    >
                        <Bell className="w-4 h-4" />
                        {hasNotifications && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400 animate-thor-pulse" />
                        )}
                    </motion.button>

                    {/* Notifications Panel */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50 glass-panel"
                                style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)" }}
                            >
                                <div className="px-4 py-3 border-b border-zinc-800/50">
                                    <p className="text-sm font-semibold text-white">Notifications</p>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {/* Safety Pulse */}
                                    {showPulse && (
                                        <div className="px-4 py-3 border-b border-zinc-800/50 border-l-2 border-l-yellow-400">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500/10">
                                                    <Heart className="w-4 h-4 text-red-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-white">Safety Pulse Check</p>
                                                    <p className="text-xs mt-1 text-zinc-500">It's time for your safety check-in</p>
                                                    <button
                                                        onClick={handlePulseConfirm}
                                                        className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        Check In Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* AI Prediction Alert */}
                                    {aiPrediction && aiPrediction.status !== "Proceed" && (
                                        <div className={`px-4 py-3 border-b border-zinc-800/50 border-l-2 ${aiPrediction.status === "Delay" ? "border-l-blue-400" : "border-l-red-400"
                                            }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${aiPrediction.status === "Delay" ? "bg-orange-500/10" : "bg-red-500/10"
                                                    }`}>
                                                    <AlertTriangle className={`w-4 h-4 ${aiPrediction.status === "Delay" ? "text-orange-400" : "text-red-400"
                                                        }`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-white">Route Alert</p>
                                                    <p className="text-xs mt-1 text-zinc-500">{aiPrediction.recommendation}</p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs text-zinc-500"><strong>Weather:</strong> {aiPrediction.weather}</p>
                                                        <p className="text-xs text-zinc-500"><strong>Traffic:</strong> {aiPrediction.traffic}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Safety Status */}
                                    <div className="px-4 py-3 border-b border-zinc-800/50 border-l-2 border-l-green-400">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/10">
                                                <Shield className="w-4 h-4 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">Safety Status</p>
                                                <p className="text-xs mt-1 text-zinc-500">Last check-in: {lastPulse}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Journey Info */}
                                    {hasActiveJourney && (
                                        <div className="px-4 py-3 border-l-2 border-l-blue-400">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/10">
                                                    <MapPin className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">Journey Active</p>
                                                    <p className="text-xs mt-1 text-zinc-500">{destination} • {stopsCount} stops</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* No notifications */}
                                    {!showPulse && (!aiPrediction || aiPrediction.status === "Proceed") && !hasActiveJourney && (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-zinc-500">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Avatar */}
                <div className="relative" ref={profileRef}>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-1.5 ml-1"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-yellow-400 text-black">
                            {user?.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${showProfile ? "rotate-180" : ""}`} />
                    </motion.button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50 glass-panel text-sm"
                                style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)" }}
                            >
                                <div className="px-4 py-3 border-b border-zinc-800/50">
                                    <p className="font-semibold text-white truncate">{user?.name || "Traveler"}</p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{user?.email || ""}</p>
                                </div>
                                <div className="py-1">
                                    {[
                                        { icon: User, label: "Profile", action: () => navigate("/profile") },
                                        { icon: Settings, label: "Settings", action: () => navigate("/settings") },
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button key={item.label} onClick={() => { item.action(); setShowProfile(false); }}
                                                className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all text-zinc-300 hover:text-white hover:bg-white/5"
                                            >
                                                <Icon className="w-4 h-4" />{item.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="py-1 border-t border-zinc-800/50">
                                    <button onClick={() => { logout(); navigate("/login"); setShowProfile(false); }}
                                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all text-red-400 hover:bg-red-500/10"
                                    >
                                        <LogOut className="w-4 h-4" />Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
}

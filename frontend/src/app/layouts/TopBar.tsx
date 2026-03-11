import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, ChevronDown, Settings, Zap, Moon, Sun, Heart, AlertTriangle, Shield, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TopBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

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
            
            // Count stops
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

        // Initial load
        handleStorageChange();
        
        // Listen for changes
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

    return (
        <header
            className="mx-4 mt-6 mb-2 rounded-2xl flex items-center justify-between px-5 flex-shrink-0 relative z-20"
            style={{ height: "64px", background: "var(--thor-surface)", border: "1px solid var(--thor-border)", boxShadow: "var(--thor-shadow-solid)" }}
        >
            {/* Branding */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <Zap className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span className="text-xl font-bold tracking-tight" style={{ color: "var(--thor-text)" }}>THOR</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-zinc-800"
                    style={{ color: "var(--thor-text-secondary)" }}
                    title="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-zinc-800"
                        style={{ color: "var(--thor-text-secondary)" }}
                    >
                        <Bell className="w-5 h-5" />
                        {(showPulse || (aiPrediction?.status && aiPrediction.status !== "Proceed")) && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div
                            className="absolute right-0 top-full mt-3 w-80 rounded-xl overflow-hidden z-50"
                            style={{ background: "var(--thor-surface-2)", border: "1px solid var(--thor-border)", boxShadow: "0 10px 40px -10px rgba(0,0,0,1)" }}
                        >
                            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--thor-border)" }}>
                                <p className="font-semibold" style={{ color: "var(--thor-text)" }}>Notifications</p>
                            </div>
                            
                            <div className="max-h-96 overflow-y-auto">
                                {/* Safety Pulse Notification */}
                                {showPulse && (
                                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--thor-border)", backgroundColor: "rgba(239,68,68,0.1)" }}>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.2)" }}>
                                                <Heart className="w-4 h-4 text-red-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold" style={{ color: "var(--thor-text)" }}>Safety Pulse Check</p>
                                                <p className="text-xs mt-1" style={{ color: "var(--thor-text-secondary)" }}>It's time for your safety check-in</p>
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
                                    <div className={`px-4 py-3 border-b ${
                                        aiPrediction.status === "Delay" ? "bg-orange-500/5" : "bg-red-500/5"
                                    }`} style={{ borderColor: "var(--thor-border)" }}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                aiPrediction.status === "Delay" ? "bg-orange-500/10" : "bg-red-500/10"
                                            }`}>
                                                <AlertTriangle className={`w-4 h-4 ${
                                                    aiPrediction.status === "Delay" ? "text-orange-500" : "text-red-500"
                                                }`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold" style={{ color: "var(--thor-text)" }}>Route Alert</p>
                                                <p className="text-xs mt-1" style={{ color: "var(--thor-text-secondary)" }}>{aiPrediction.recommendation}</p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs" style={{ color: "var(--thor-text-secondary)" }}><strong>Weather:</strong> {aiPrediction.weather}</p>
                                                    <p className="text-xs" style={{ color: "var(--thor-text-secondary)" }}><strong>Traffic:</strong> {aiPrediction.traffic}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Last Pulse Info */}
                                <div className="px-4 py-3 border-b" style={{ borderColor: "var(--thor-border)" }}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(34,197,94,0.1)" }}>
                                            <Shield className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold" style={{ color: "var(--thor-text)" }}>Safety Status</p>
                                            <p className="text-xs mt-1" style={{ color: "var(--thor-text-secondary)" }}>Last check-in: {lastPulse}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Journey Info */}
                                {hasActiveJourney && (
                                    <div className="px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(59,130,246,0.1)" }}>
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold" style={{ color: "var(--thor-text)" }}>Journey Active</p>
                                                <p className="text-xs mt-1" style={{ color: "var(--thor-text-secondary)" }}>{destination} • {stopsCount} stops</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* No notifications */}
                                {!showPulse && (!aiPrediction || aiPrediction.status === "Proceed") && !hasActiveJourney && (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-sm" style={{ color: "var(--thor-text-secondary)" }}>No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 p-1 rounded-xl transition-all hover:bg-zinc-800"
                        style={{ color: "var(--thor-text-secondary)" }}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                            {user?.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showProfile ? "rotate-180" : ""}`} />
                    </button>

                    {showProfile && (
                        <div
                            className="absolute right-0 top-full mt-3 w-56 rounded-xl overflow-hidden z-50 text-sm"
                            style={{ background: "var(--thor-surface-2)", border: "1px solid var(--thor-border)", boxShadow: "0 10px 40px -10px rgba(0,0,0,1)" }}
                        >
                            <div className="px-4 py-3 border-b border-zinc-800">
                                <p className="font-semibold truncate" style={{ color: "var(--thor-text)" }}>{user?.name || "Traveler"}</p>
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
                                            className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all hover:opacity-75"
                                            style={{ color: "var(--thor-text)" }}
                                        >
                                            <Icon className="w-4 h-4" />{item.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="py-1 border-t border-zinc-800">
                                <button onClick={() => { logout(); navigate("/login"); setShowProfile(false); }}
                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <LogOut className="w-4 h-4" />Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

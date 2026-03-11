import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Globe, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import { useTheme } from "../../context/ThemeContext";
import { staggerContainer, fadeUp } from "../../../motion/variants";

import { API_URL } from "../../config/api";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { language, setLanguage, supportedLanguages } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError("All fields are required"); return; }
        setLoading(true); setError("");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.detail || "Login failed. Please check your credentials.");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setLoading(false);
                return;
            }
            login(data.access_token, data.user);
            const savedMode = localStorage.getItem("thor-mode");
            navigate(savedMode === "enterprise" ? "/enterprise" : "/dashboard");
        } catch {
            setError("Unable to reach server. Check your connection.");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        setLoading(false);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={fadeUp} className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                    style={{ color: "var(--thor-text-secondary)" }}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-zinc-500 mb-8">
                Sign in to your account to continue
            </motion.p>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                        x: shake ? [0, -8, 8, -6, 6, 0] : 0
                    }}
                    transition={{ duration: shake ? 0.4 : 0.2 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 border border-red-500/20"
                    style={{ background: "var(--thor-danger-muted)", color: "var(--thor-danger)" }}
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={fadeUp}>
                    <label className="text-xs font-medium block mb-2 text-zinc-400">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.15)]"
                            style={{ paddingLeft: "2.75rem" }}
                        />
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <label className="text-xs font-medium block mb-2 text-zinc-400">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.15)]"
                            style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <label className="text-xs font-medium block mb-2 text-zinc-400">Preferred Language</label>
                    <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-xl text-sm appearance-none transition-all focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.15)]"
                            style={{ paddingLeft: "2.75rem" }}
                        >
                            {supportedLanguages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    >
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Zap className="w-5 h-5" fill="currentColor" />
                            </motion.div>
                        ) : (
                            <>Sign in <ArrowRight className="w-4 h-4" /></>
                        )}
                    </motion.button>
                </motion.div>
            </form>

            <motion.p variants={fadeUp} className="text-sm text-center mt-8 text-zinc-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">Create account</Link>
            </motion.p>
        </motion.div>
    );
}

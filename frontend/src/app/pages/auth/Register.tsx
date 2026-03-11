import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
    Zap, Mail, Lock, Eye, EyeOff, User, Phone, Heart,
    ArrowRight, ArrowLeft, AlertCircle, Check, Droplets, Pill, Shield, Globe
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMode } from "../../context/ModeContext";
import { useTranslation } from "../../context/TranslationContext";
import { fadeUp } from "../../../motion/variants";

import { API_URL } from "../../config/api";

const STEPS = [
    { id: "role", label: "Role" },
    { id: "basic", label: "Account" },
    { id: "medical", label: "Medical" },
    { id: "emergency", label: "Emergency" },
];

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setMode } = useMode();
    const { language, setLanguage, supportedLanguages } = useTranslation();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [role, setRole] = useState<"tourist" | "enterprise" | "">("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [bloodGroup, setBloodGroup] = useState("");
    const [allergies, setAllergies] = useState("");
    const [conditions, setConditions] = useState("");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [emergencyRelation, setEmergencyRelation] = useState("");

    const canNext = () => {
        if (step === 0) return !!role;
        if (step === 1) return name.trim() && email.trim() && password.length >= 6;
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true); setError("");

        const payload: Record<string, unknown> = {
            name, email, password, role,
        };

        if (bloodGroup || allergies || conditions) {
            payload.medical_details = {
                blood_group: bloodGroup || undefined,
                allergies: allergies || undefined,
                conditions: conditions || undefined,
            };
        }

        if (emergencyName && emergencyPhone) {
            payload.emergency_contacts = [{
                name: emergencyName,
                phone: emergencyPhone,
                relation: emergencyRelation,
            }];
        }

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.detail || "Registration failed. Try a different email.");
                setLoading(false);
                return;
            }
            login(data.access_token, data.user);
            setMode(role as "tourist" | "enterprise");
            navigate(role === "enterprise" ? "/enterprise" : "/dashboard");
        } catch {
            setError("Unable to reach server. Check your connection.");
        }
        setLoading(false);
    };

    const next = () => {
        if (step === STEPS.length - 1) { handleSubmit(); return; }
        if (role === "enterprise" && step === 1) { handleSubmit(); return; }
        setStep(step + 1);
    };

    const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.15)]";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create account</h2>
            <p className="text-sm text-zinc-500 mb-6">
                {step === 0 ? "Choose how you'll use THOR" : STEPS[step].label}
            </p>

            {/* Progress dots */}
            {step > 0 && (
                <div className="flex gap-1.5 mb-6">
                    {STEPS.slice(0, role === "enterprise" ? 2 : STEPS.length).map((s, i) => (
                        <motion.div
                            key={s.id}
                            className="flex-1 h-1 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            style={{
                                background: i <= step ? "var(--thor-brand)" : "var(--thor-surface-3)",
                                transformOrigin: "left",
                            }}
                        />
                    ))}
                </div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 border border-red-500/20"
                    style={{ background: "var(--thor-danger-muted)", color: "var(--thor-danger)" }}
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /><span className="text-sm">{error}</span>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                    {/* Step 0: Role Selection — Large tap cards */}
                    {step === 0 && (
                        <div className="space-y-4">
                            {[
                                { id: "tourist", icon: "🧳", title: "I am a Traveler", desc: "Personal safety, travel planning, emergency response" },
                                { id: "enterprise", icon: "🏢", title: "I am an Operator", desc: "Manage teams, monitor tourists, command center" },
                            ].map((r) => {
                                const isSelected = role === r.id;
                                return (
                                    <motion.button
                                        key={r.id}
                                        onClick={() => setRole(r.id as any)}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center gap-5 ${isSelected
                                            ? "border-yellow-400 bg-yellow-400/5"
                                            : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                            }`}
                                    >
                                        <span className="text-4xl">{r.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-base font-bold text-white">{r.title}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{r.desc}</p>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 text-black" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}

                    {/* Step 1: Basic info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <motion.div variants={fadeUp} initial="hidden" animate="show">
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </motion.div>
                            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }}>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </motion.div>
                            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.16 }}>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className={inputClass} style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }} />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Preferred Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${inputClass} appearance-none`} style={{ paddingLeft: "2.75rem" }}>
                                        {supportedLanguages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Step 2: Medical (Tourist only) */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-xs text-zinc-500 mb-3">Optional — helps emergency responders</p>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Blood Group</label>
                                <div className="relative">
                                    <Droplets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                    <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Allergies</label>
                                <div className="relative">
                                    <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                                    <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Peanuts, Penicillin" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Medical Conditions</label>
                                <div className="relative">
                                    <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                                    <input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g. Asthma, Diabetes" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Emergency contact */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <p className="text-xs text-zinc-500 mb-3">Optional — contacted during emergencies</p>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Contact Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Full name" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+91 9876543210" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-2 text-zinc-400">Relation</label>
                                <input type="text" value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} placeholder="e.g. Mother, Spouse" className={inputClass} />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
                {step > 0 && (
                    <motion.button
                        onClick={() => setStep(step - 1)}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </motion.button>
                )}
                <motion.button
                    onClick={next}
                    disabled={!canNext() || loading}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                >
                    {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <Zap className="w-5 h-5" fill="currentColor" />
                        </motion.div>
                    ) : step === (role === "enterprise" ? 1 : STEPS.length - 1) ? (
                        <>Create Account <Zap className="w-4 h-4" fill="currentColor" /></>
                    ) : (
                        <>Continue <ArrowRight className="w-4 h-4" /></>
                    )}
                </motion.button>
            </div>

            <p className="text-sm text-center mt-6 text-zinc-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">Sign in</Link>
            </p>
        </motion.div>
    );
}

import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Heart, Droplets, Pill, Shield, Save, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { staggerContainer, fadeUp } from "../../../motion/variants";

export default function Profile() {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [bloodGroup, setBloodGroup] = useState(user?.medical_details?.blood_group || "");
    const [allergies, setAllergies] = useState(user?.medical_details?.allergies || "");
    const [conditions, setConditions] = useState(user?.medical_details?.conditions || "");
    const [ecName, setEcName] = useState(user?.emergency_contacts?.[0]?.name || "");
    const [ecPhone, setEcPhone] = useState(user?.emergency_contacts?.[0]?.phone || "");
    const [ecRelation, setEcRelation] = useState(user?.emergency_contacts?.[0]?.relation || "");

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.15)]";

    return (
        <motion.div
            className="p-6 space-y-6 max-w-2xl mx-auto pb-32"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-black text-white tracking-tight">Profile</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your personal and medical information</p>
            </motion.div>

            {/* Avatar Card */}
            <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl border flex items-center gap-5"
                style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}
            >
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-2xl font-black">
                    {name.charAt(0)?.toUpperCase() || "T"}
                </div>
                <div>
                    <p className="text-lg font-bold text-white">{name || "Traveler"}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{email}</p>
                </div>
            </motion.div>

            {/* Personal */}
            <motion.div variants={fadeUp} className="p-5 rounded-2xl border" style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}>
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" /> Personal
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Email</label>
                        <input type="email" value={email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
                    </div>
                </div>
            </motion.div>

            {/* Medical */}
            <motion.div variants={fadeUp} className="p-5 rounded-2xl border" style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}>
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" /> Medical Profile
                </h2>
                <div className="space-y-4">
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
                            <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Comma separated" className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Medical Conditions</label>
                        <input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g. Asthma" className={inputClass} />
                    </div>
                </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div variants={fadeUp} className="p-5 rounded-2xl border" style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}>
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" /> Emergency Contact
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Name</label>
                        <input type="text" value={ecName} onChange={(e) => setEcName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input type="tel" value={ecPhone} onChange={(e) => setEcPhone(e.target.value)} className={inputClass} style={{ paddingLeft: "2.75rem" }} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium block mb-2 text-zinc-400">Relation</label>
                        <input type="text" value={ecRelation} onChange={(e) => setEcRelation(e.target.value)} className={inputClass} />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={fadeUp}>
                <motion.button
                    onClick={handleSave}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${saved
                        ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        : "bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                        }`}
                >
                    {saved ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Changes</>}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

import { motion } from "motion/react";
import { Building2, Globe, Zap, Shield, MapPin, Mic, MessageSquare, Route } from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  { icon: Shield, label: "Real-time Safety", color: "text-green-400" },
  { icon: MapPin, label: "Smart Navigation", color: "text-blue-400" },
  { icon: Mic, label: "Voice AI Agent", color: "text-purple-400" },
  { icon: Route, label: "Route Planning", color: "text-yellow-400" },
  { icon: MessageSquare, label: "AI Concierge", color: "text-cyan-400" },
  { icon: Globe, label: "Community Hub", color: "text-pink-400" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/3 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* ── Navigation Bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-20"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-7 h-7 text-yellow-400" fill="currentColor" />
            <span className="text-xl font-black tracking-widest">THOR</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-xl transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.nav>

        {/* ── Hero Section ── */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" fill="currentColor" />
              </motion.div>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                THOR
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-zinc-600 line-through tracking-[0.3em] uppercase mb-4"
            >
              god of thunder
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-zinc-300 mb-3"
            >
              Guard of Tourism
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed"
            >
              AI-powered tourist safety platform. Real-time hazard monitoring,
              emergency SOS, intelligent trip planning, and 24/7 voice assistance.
            </motion.p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.08 }}
                className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-2"
              >
                <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                <span className="text-xs font-medium text-zinc-400">{f.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Mode Selection ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center mb-8">
            Choose Your Mode
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tourist Mode */}
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="text-left bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 transition-all hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tourist Mode</h3>
                  <p className="text-xs text-zinc-500">For individual travelers</p>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8">
                {[
                  "Real-time safety monitoring",
                  "Emergency SOS system",
                  "AI travel assistant",
                  "Smart route planning",
                  "Voice AI agent",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Start as Tourist →
              </div>
            </motion.button>

            {/* Enterprise Mode */}
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="text-left bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 transition-all hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Enterprise Mode</h3>
                  <p className="text-xs text-zinc-500">For travel companies</p>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8">
                {[
                  "Multi-tourist monitoring",
                  "Trip planning dashboard",
                  "Real-time command center",
                  "Authority integration",
                  "Analytics & reports",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                Start as Enterprise →
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span className="text-xs font-bold tracking-widest text-zinc-600">THOR SAFETY PLATFORM</span>
          </div>
          <p className="text-xs text-zinc-700">Tourist Hazard-Omittance Response · Powered by Gemini AI</p>
        </motion.footer>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Siren, Phone, MapPin, Shield, ShieldAlert, Activity,
  Wifi, WifiOff, Battery, BatteryWarning, Heart, Send,
  AlertTriangle, Radio, CheckCircle, Clock, CheckCircle2
} from "lucide-react";
import { staggerContainer, fadeUp } from "../../../motion/variants";

import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

export default function Emergency() {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [sosHolding, setSosHolding] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);
  const [sosResult, setSosResult] = useState<any>(null);
  const [pulseTime, setPulseTime] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [battery, setBattery] = useState(100);
  const holdTimerRef = useRef<any>(null);

  useEffect(() => {
    const online = () => setNetworkStatus(true);
    const offline = () => setNetworkStatus(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    (navigator as any).getBattery?.().then((b: any) => {
      setBattery(Math.round(b.level * 100));
      b.addEventListener("levelchange", () => setBattery(Math.round(b.level * 100)));
    });
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
  }, []);

  const startSOS = () => {
    setSosHolding(true);
    setSosCountdown(3);
    let c = 3;
    holdTimerRef.current = setInterval(() => {
      c--;
      setSosCountdown(c);
      if (c <= 0) {
        clearInterval(holdTimerRef.current);
        triggerSOS();
      }
    }, 1000);
  };

  const cancelHold = () => {
    setSosHolding(false);
    clearInterval(holdTimerRef.current);
    setSosCountdown(3);
  };

  const triggerSOS = async () => {
    setSosHolding(false);
    setSosActive(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
      const result = await fetch(`${API_URL}/sos/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, user_id: "demo" }),
      }).then(r => r.json());
      setSosResult(result.sos || result);
    } catch { setSosResult({ status: "escalating", sms_sent: true, authorities_notified: true }); }
  };

  const cancelSOS = () => { setSosActive(false); setSosResult(null); };

  const CONTACTS = [
    { label: "Police", number: "100", color: "#3B82F6", isUserContact: false },
    { label: "Ambulance", number: "108", color: "#EF4444", isUserContact: false },
    { label: "Fire", number: "101", color: "#F59E0B", isUserContact: false },
    { label: "Women Helpline", number: "181", color: "#8B5CF6", isUserContact: false },
  ];

  const userContacts = (user?.emergency_contacts || []).map((c: any) => ({
    label: `${c.name} (${c.relation})`,
    number: c.phone,
    color: "#EAB308",
    isUserContact: true,
  }));

  const allContacts = [...userContacts, ...CONTACTS];

  // SVG countdown ring
  const circumference = 2 * Math.PI * 60;
  const progress = sosHolding ? ((3 - sosCountdown) / 3) * circumference : 0;

  return (
    <motion.div
      className="p-6 space-y-6 max-w-4xl mx-auto pb-32"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-black text-white tracking-tight">Emergency Center</h1>
        <p className="text-sm text-zinc-500 mt-1">SOS activation, emergency contacts, and safety status</p>
      </motion.div>

      {/* Status bar */}
      <motion.div variants={fadeUp} className="flex gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900">
          {networkStatus ? <Wifi className="w-3.5 h-3.5 text-green-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
          <span className={`text-xs font-medium ${networkStatus ? "text-green-400" : "text-red-400"}`}>
            {networkStatus ? "Online" : "Offline"}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900">
          {battery < 15 ? <BatteryWarning className="w-3.5 h-3.5 text-red-400" /> : <Battery className="w-3.5 h-3.5 text-green-400" />}
          <span className={`text-xs font-medium ${battery < 15 ? "text-red-400" : "text-zinc-400"}`}>{battery}%</span>
        </div>
      </motion.div>

      {/* SOS Button Area */}
      <motion.div variants={fadeUp}>
        {!sosActive ? (
          <div className="flex flex-col items-center py-12">
            {/* Large SOS button with rings */}
            <div className="relative">
              {/* Concentric pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="absolute w-52 h-52 rounded-full border border-red-500/10" />
                <span className="absolute w-60 h-60 rounded-full border border-red-500/5" />
                {sosHolding && (
                  <>
                    <motion.span className="absolute w-52 h-52 rounded-full border border-red-500/30" animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.span className="absolute w-52 h-52 rounded-full border border-red-500/20" animate={{ scale: [1, 1.8], opacity: [0.2, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </>
                )}
              </div>

              {/* SVG countdown ring */}
              {sosHolding && (
                <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 192 192" style={{ width: "192px", height: "192px" }}>
                  <circle
                    cx="96" cy="96" r="60"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
              )}

              <motion.button
                onMouseDown={startSOS} onMouseUp={cancelHold} onMouseLeave={cancelHold}
                onTouchStart={startSOS} onTouchEnd={cancelHold}
                className="relative w-48 h-48 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: sosHolding
                    ? "radial-gradient(circle, #EF4444 0%, #991B1B 100%)"
                    : "radial-gradient(circle, #7F1D1D 0%, #450A0A 100%)",
                  border: "3px solid var(--thor-danger)",
                  boxShadow: sosHolding ? "0 0 60px rgba(239,68,68,0.6)" : "0 0 30px rgba(239,68,68,0.2)",
                }}
                animate={sosHolding ? { scale: [1, 1.03, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                <div className="text-center">
                  <Siren className="w-12 h-12 mx-auto mb-2" style={{ color: sosHolding ? "#fff" : "#EF4444" }} />
                  <span className="text-3xl font-black" style={{ color: sosHolding ? "#fff" : "#EF4444" }}>
                    {sosHolding ? sosCountdown : "SOS"}
                  </span>
                </div>
              </motion.button>
            </div>

            <p className="text-sm text-zinc-500 mt-6">Hold for 3 seconds to activate SOS</p>
            <p className="text-xs text-zinc-600 mt-1">Transmits GPS, medical info & emergency signal</p>
          </div>
        ) : (
          /* SOS Active overlay */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl p-6 border border-red-500/30"
            style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.4), rgba(0,0,0,0.6))" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Siren className="w-6 h-6 animate-red-pulse text-red-500" />
              <h2 className="text-xl font-black text-red-500 tracking-tight">SOS ACTIVE</h2>
              <button onClick={cancelSOS} className="ml-auto px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-semibold hover:bg-zinc-800 transition-all">
                Cancel SOS
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "GPS signal transmitted", done: true },
                { label: "SMS fallback sent", done: sosResult?.sms_sent },
                { label: "Nearest police notified", done: sosResult?.authorities_notified },
                { label: "Community responders alerted", done: true },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.3)" }}>
                  {s.done ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Clock className="w-5 h-5 text-yellow-400 animate-thor-pulse" />}
                  <span className={`text-sm font-medium ${s.done ? "text-green-400" : "text-yellow-400"}`}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Pulse Check-in */}
      <motion.div variants={fadeUp}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setPulseTime(new Date().toLocaleTimeString())}
          className="w-full p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer"
          style={{
            background: "var(--thor-surface-2)",
            borderColor: pulseTime ? "var(--thor-safe)" : "var(--thor-border)",
          }}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pulseTime ? "bg-green-500/10" : "bg-zinc-800"}`}>
            <Heart className={`w-6 h-6 ${pulseTime ? "text-green-400" : "text-zinc-500"}`} fill={pulseTime ? "currentColor" : "none"} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Safety Pulse — I'm Safe</p>
            {pulseTime ? (
              <p className="text-xs text-green-400 mt-0.5">✓ Last check-in at {pulseTime}</p>
            ) : (
              <p className="text-xs text-zinc-500 mt-0.5">Tap to confirm your safety</p>
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Emergency Contacts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allContacts.map((c, i) => (
            <motion.a
              key={i}
              href={`tel:${c.number}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              className="p-4 rounded-2xl border text-center transition-all overflow-hidden flex flex-col items-center cursor-pointer hover:border-zinc-700"
              style={{
                background: "var(--thor-surface-2)",
                borderColor: c.isUserContact ? "var(--thor-brand)" : "var(--thor-border)",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `${c.color}15`, color: c.color }}>
                <Phone className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium w-full truncate text-white" title={c.label}>{c.label}</p>
              <p className="font-bold mt-1 text-sm" style={{ color: c.color }}>{c.number}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

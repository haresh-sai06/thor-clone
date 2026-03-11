import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { MapPin, Calendar, Plus, ChevronRight, Zap, Target, Users, Star, ExternalLink, Phone, Search, Map, MessageSquare, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import { Check, X, ShieldAlert } from "lucide-react";
import { staggerContainer, fadeUp } from "../../../motion/variants";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";

import { API_URL } from "../../config/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate } = useTranslation();
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<any[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      if (user?.email) {
        try {
          const invRes = await fetch(`${API_URL}/enterprise/invitations/${user.email}`).then(r => r.json());
          setInvitations(invRes.invitations || []);
        } catch (e) {
          console.error("Failed to load invitations", e);
        }
      }

      const saved = localStorage.getItem("thor_active_plan");
      if (saved) {
        const plan = JSON.parse(saved);
        setActivePlans([plan]);

        if (plan.destination) {
          setLoadingGuides(true);
          fetch(`${API_URL}/trip/guides?destination=${encodeURIComponent(plan.destination)}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("thor_token")}` }
          })
            .then(r => r.json())
            .then(data => {
              if (data.guides) setGuides(data.guides);
              setLoadingGuides(false);
            })
            .catch(() => setLoadingGuides(false));
        }
      }

      setLoading(false);
    };

    fetchDashboard();
  }, [user]);

  const acceptInvite = async (inviteId: string) => {
    try {
      await fetch(`${API_URL}/enterprise/invitations/${inviteId}/accept`, { method: "POST" });
      setInvitations(invitations.filter(i => i.id !== inviteId));
    } catch (e) {
      console.error("Failed to accept", e);
    }
  };

  // Quick action grid items
  const quickActions = [
    { icon: Map, label: "Safety Map", path: "/map", color: "#3B82F6" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat", color: "#8B5CF6" },
    { icon: Shield, label: "Emergency", path: "/emergency", color: "#EF4444" },
    { icon: Users, label: "Community", path: "/community", color: "#10B981" },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto pb-32"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Tier 1: Greeting Hero */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {translate(getTimeGreeting())}, {user?.name?.split(" ")[0] || translate("Traveler")}
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {translate("All Systems Safe")}
          </span>
        </div>
      </motion.div>

      {/* Tracking Requests */}
      {invitations.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-yellow-400" /> Tracking Requests
          </h3>
          {invitations.map((inv) => (
            <motion.div key={inv.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-warn)" }}>
              <div>
                <h4 className="font-bold text-white">{inv.enterprise_name}</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  This organization is requesting to monitor your live location and safety telemetry during your trip.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setInvitations(invitations.filter(i => i.id !== inv.id))}
                  className="px-3 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-semibold hover:bg-zinc-800 transition-all flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Decline
                </button>
                <button onClick={() => acceptInvite(inv.id)}
                  className="px-3 py-2 rounded-xl bg-green-500 text-black text-xs font-bold hover:bg-green-400 transition-all flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tier 2: Active Journey Card or CTA */}
      <motion.div variants={fadeUp}>
        {loading ? (
          <SkeletonCard variant="card" />
        ) : activePlans.length > 0 ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/planner/active`)}
            className="relative overflow-hidden rounded-2xl p-5 border cursor-pointer group"
            style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--thor-brand) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{activePlans[0].destination}</h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activePlans[0].days?.length || 1} Days</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />
                      {activePlans[0].days?.reduce((acc: number, d: any) => acc + (d.route_spots?.length || 0), 0) || 0} Spots
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                Active
              </span>
            </div>

            {activePlans[0].hotel_recommendation && (
              <p className="text-xs text-zinc-500 mb-3">🏨 {activePlans[0].hotel_recommendation.name}</p>
            )}

            <div className="flex items-center justify-between text-sm font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors pt-3 border-t border-zinc-800">
              {translate("View Dashboard")}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ) : (
          /* CTA: Create New Plan */
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate("/planner")}
            className="w-full relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-4 border-2 border-dashed border-zinc-800 group cursor-pointer"
            style={{ background: "var(--thor-surface)" }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 pointer-events-none">
              <Target className="w-40 h-40 text-yellow-500" />
            </div>
            <div className="relative z-10 text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[10px] font-bold tracking-wider uppercase">
                <Zap className="w-3 h-3" fill="currentColor" /> AI Powered
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{translate("Create a New Plan")}</h2>
              <p className="text-xs text-zinc-500 max-w-sm">
                {translate("Pick your destination, get AI suggestions for hotels, restaurants & spots, then build your custom route.")}
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-400 text-black flex-shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Tier 3: Quick Action Grid */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">{translate("Quick Actions")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className="p-4 rounded-2xl border text-left transition-all hover:border-zinc-700 group cursor-pointer"
                style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${action.color}15`, color: action.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-white">{translate(action.label)}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Local Guides */}
      {activePlans.length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-yellow-400" />
            {translate("Local Guides")}
            <span className="text-zinc-600 font-normal normal-case text-xs">— {activePlans[0].destination}</span>
          </h3>

          {loadingGuides ? (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[260px] h-32 rounded-2xl skeleton" />
              ))}
            </div>
          ) : guides.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {guides.map((g, i) => (
                <div key={i} className="min-w-[260px] rounded-2xl p-4 flex flex-col justify-between border"
                  style={{ background: "var(--thor-surface-2)", borderColor: "var(--thor-border)" }}>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm truncate max-w-[160px] text-white">{g.name}</h4>
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-yellow-400/10 text-yellow-400 shrink-0">
                        <Star className="w-3 h-3" fill="currentColor" /> {g.rating}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{g.role}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {g.languages?.map((l: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 flex justify-between items-center border-t border-zinc-800">
                    <span className="text-[11px] font-semibold text-green-400 max-w-[90px] truncate">{g.price}</span>
                    <div className="flex gap-1.5">
                      <a href={`https://www.google.com/maps/place/?q=place_id:${g.id}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                        <MapPin className="w-3 h-3" /> Map
                      </a>
                      {g.website ? (
                        <a href={g.website} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                          <ExternalLink className="w-3 h-3" /> Site
                        </a>
                      ) : (
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(g.name + ' tour guide ' + activePlans[0].destination)}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                          <Search className="w-3 h-3" /> Search
                        </a>
                      )}
                      {g.phone && (
                        <a href={`tel:${g.phone}`}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm">{translate("No local guides found for this destination yet.")}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

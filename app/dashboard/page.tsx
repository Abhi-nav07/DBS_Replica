"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Mail,
  TrendingUp,
  Activity,
  RefreshCw,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Inbox,
  MapPin,
  Layers,
  Terminal,
  Cpu,
  Search,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";

interface ClientInquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  details: string;
  date: string;
  status: string;
  phone?: string;
}

const CHART_INITIAL: { time: string; leads: number; sessions: number }[] = [
  { time: "00:00", leads: 0, sessions: 2 },
  { time: "04:00", leads: 1, sessions: 5 },
  { time: "08:00", leads: 2, sessions: 9 },
  { time: "12:00", leads: 4, sessions: 14 },
  { time: "16:00", leads: 3, sessions: 11 },
  { time: "20:00", leads: 5, sessions: 18 },
  { time: "Now", leads: 0, sessions: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "In Review": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Closed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const OFFICES = ["Dehradun", "Pune", "Mumbai", "Australia"];

const CAPABILITIES = [
  {
    icon: <Layers size={28} className="text-indigo-400" />,
    title: "Custom Software",
    desc: "Scalable backend automation engines tailored precisely for enterprise pipelines.",
  },
  {
    icon: <Terminal size={28} className="text-emerald-400" />,
    title: "Web Architectures",
    desc: "Ultra-responsive custom web applications built on Next.js rendering engines.",
  },
  {
    icon: <Cpu size={28} className="text-purple-400" />,
    title: "AI-First Nodes",
    desc: "Integrating neural processing, automation agents, and semantic query models.",
  },
  {
    icon: <Search size={28} className="text-amber-400" />,
    title: "SEO Dominance",
    desc: "Data-driven search visibility algorithms engineered to capture organic markets.",
  },
];

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [leads, setLeads] = useState<ClientInquiry[]>([]);
  const [chartData, setChartData] = useState(CHART_INITIAL);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [pipelineForm, setPipelineForm] = useState({
    name: "",
    email: "",
    deployment: "Web Application Framework",
    budget: "₹50,000 - ₹2,000,000",
  });
  const [pipelineSubmitted, setPipelineSubmitted] = useState(false);

  const loadLeads = useCallback(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("dbs_leads");
    const parsed: ClientInquiry[] = raw ? JSON.parse(raw) : [];
    setLeads(parsed);

    setChartData((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        time: "Now",
        leads: parsed.length,
        sessions: Math.max(parsed.length * 3, 2),
      };
      return updated;
    });

    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadLeads();
    const interval = setInterval(loadLeads, 2000);
    return () => clearInterval(interval);
  }, [loadLeads]);

  const handleStatusChange = (id: number, newStatus: string) => {
    const raw = localStorage.getItem("dbs_leads");
    const parsed: ClientInquiry[] = raw ? JSON.parse(raw) : [];
    const updated = parsed.map((l) =>
      l.id === id ? { ...l, status: newStatus } : l
    );
    localStorage.setItem("dbs_leads", JSON.stringify(updated));
    setLeads(updated);
  };

  const handlePipelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry: ClientInquiry = {
      id: Date.now(),
      name: pipelineForm.name,
      email: pipelineForm.email,
      company: pipelineForm.deployment,
      details: `Budget: ${pipelineForm.budget} | Deployment: ${pipelineForm.deployment}`,
      date: new Date().toISOString(),
      status: "New",
    };
    const raw = localStorage.getItem("dbs_leads");
    const parsed: ClientInquiry[] = raw ? JSON.parse(raw) : [];
    parsed.unshift(inquiry);
    localStorage.setItem("dbs_leads", JSON.stringify(parsed));
    setLeads(parsed);
    setPipelineSubmitted(true);
    setPipelineForm({
      name: "",
      email: "",
      deployment: "Web Application Framework",
      budget: "₹50,000 - ₹2,000,000",
    });
    setTimeout(() => setPipelineSubmitted(false), 3000);
  };

  const filteredLeads =
    filterStatus === "All"
      ? leads
      : leads.filter((l) => l.status === filterStatus);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const inReview = leads.filter((l) => l.status === "In Review").length;
  const closed = leads.filter((l) => l.status === "Closed").length;

  return (
    <div className="min-h-screen bg-[#080c1a] text-white">
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">
              DBS
            </div>
            <span className="font-bold text-sm tracking-wider text-white">
              DIGITAL BYTE<span className="text-indigo-400">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Services
            </button>
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Cost Estimator
            </button>
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Locations
            </button>
          </div>

          <Link href="/">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
              Admin Command Center
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── HEADER ── */}
        <div className="mb-10">
          <p className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Live Sync Admin Center
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            Pipeline Command Dashboard
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live polling active · Last sync:{" "}
            <span className="text-slate-300 font-mono">{lastUpdated || "—"}</span>
            <button
              onClick={loadLeads}
              className="ml-2 text-slate-500 hover:text-white transition-colors"
            >
              <RefreshCw size={12} />
            </button>
          </p>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Inquiries",
              value: totalLeads,
              icon: <Users size={20} className="text-indigo-400" />,
              color: "border-indigo-500/20 bg-indigo-500/5",
              delta: "+Live",
            },
            {
              label: "New Leads",
              value: newLeads,
              icon: <Inbox size={20} className="text-sky-400" />,
              color: "border-sky-500/20 bg-sky-500/5",
              delta: "Pending review",
            },
            {
              label: "In Review",
              value: inReview,
              icon: <Clock size={20} className="text-amber-400" />,
              color: "border-amber-500/20 bg-amber-500/5",
              delta: "Processing",
            },
            {
              label: "Closed",
              value: closed,
              icon: <CheckCircle size={20} className="text-emerald-400" />,
              color: "border-emerald-500/20 bg-emerald-500/5",
              delta: "Completed",
            },
          ].map((card, i) => (
            <div key={i} className={`rounded-2xl border p-5 ${card.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className="text-xs text-slate-500 font-mono">{card.delta}</span>
              </div>
              <p className="text-3xl font-black text-white mb-1">{card.value}</p>
              <p className="text-slate-400 text-xs">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── CHART ── */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-lg">Activity Overview</h2>
              <p className="text-slate-500 text-xs mt-0.5">Real-time lead & session tracking</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                Leads
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Sessions
              </span>
            </div>
          </div>
          {isMounted ? (
            <div style={{ minHeight: 300, width: "99%" }}>
              <ResponsiveContainer width="99%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} fill="url(#leadGrad)" />
                  <Area type="monotone" dataKey="sessions" stroke="#38bdf8" strokeWidth={2} fill="url(#sessionGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ minHeight: 300 }} className="flex items-center justify-center text-slate-600 text-sm">
              Initializing chart…
            </div>
          )}
        </div>

        {/* ── PIPELINE TABLE ── */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white font-bold text-lg">Live Incoming Pipeline Logs</h2>
              <p className="text-slate-500 text-xs mt-0.5">Submissions from the landing page — polled every 2s</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "New", "In Review", "Closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterStatus === s
                      ? "bg-indigo-600 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Mail size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium text-sm mb-1">No pipeline entries yet</p>
              <p className="text-slate-600 text-xs">
                Submit the contact form on the landing page to see data appear here live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["ID", "Name", "Email", "Company", "Date", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left text-slate-500 text-xs font-semibold tracking-wider pb-3 pr-4 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, idx) => (
                    <tr key={lead.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                      <td className="py-3 pr-4 text-slate-600 font-mono text-xs">#{idx + 1}</td>
                      <td className="py-3 pr-4 text-white font-medium">{lead.name}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{lead.email}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{lead.company || "—"}</td>
                      <td className="py-3 pr-4 text-slate-500 text-xs font-mono">
                        {new Date(lead.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[lead.status] || "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── OPERATIONAL CAPABILITIES ── */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-xl mb-6">Our Operational Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                <div className="mb-4">{cap.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{cap.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── INTERACTIVE PIPELINE FORM ── */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">
              Interactive Core
            </p>
            <h2 className="text-white font-extrabold text-2xl md:text-3xl mb-2">
              Configure Your Project Pipeline
            </h2>
            <p className="text-slate-500 text-sm">
              Submit this form to see it instantly sync live into the Admin Dashboard portal.
            </p>
          </div>

          {pipelineSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <p className="text-white font-bold mb-1">Pipeline Transmitted!</p>
              <p className="text-slate-400 text-sm">
                Your specifications have been synced to the pipeline table above.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePipelineSubmit}>
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-slate-500 text-xs font-mono tracking-widest uppercase block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={pipelineForm.name}
                      onChange={(e) => setPipelineForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g., Abhinav"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm transition-colors duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-mono tracking-widest uppercase block mb-2">
                      Email Protocol
                    </label>
                    <input
                      type="email"
                      value={pipelineForm.email}
                      onChange={(e) => setPipelineForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm transition-colors duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-mono tracking-widest uppercase block mb-2">
                      Target Deployment Suite
                    </label>
                    <select
                      value={pipelineForm.deployment}
                      onChange={(e) => setPipelineForm((p) => ({ ...p, deployment: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
                    >
                      <option value="Web Application Framework" className="bg-[#0a0f1e]">Web Application Framework</option>
                      <option value="Mobile Application" className="bg-[#0a0f1e]">Mobile Application</option>
                      <option value="SaaS Platform" className="bg-[#0a0f1e]">SaaS Platform</option>
                      <option value="AI/ML Integration" className="bg-[#0a0f1e]">AI/ML Integration</option>
                      <option value="E-Commerce System" className="bg-[#0a0f1e]">E-Commerce System</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-mono tracking-widest uppercase block mb-2">
                      Allocated Budget Matrix
                    </label>
                    <select
                      value={pipelineForm.budget}
                      onChange={(e) => setPipelineForm((p) => ({ ...p, budget: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
                    >
                      <option value="₹50,000 - ₹2,000,000" className="bg-[#0a0f1e]">₹50,000 - ₹2,000,000</option>
                      <option value="₹2,00,000 - ₹5,00,000" className="bg-[#0a0f1e]">₹2,00,000 - ₹5,00,000</option>
                      <option value="₹5,00,000 - ₹20,00,000" className="bg-[#0a0f1e]">₹5,00,000 - ₹20,00,000</option>
                      <option value="₹20,00,000+" className="bg-[#0a0f1e]">₹20,00,000+</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 group"
                >
                  Transmit Specifications to Dashboard
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── GLOBAL INFRASTRUCTURE NODES ── */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-1">
              <h2 className="text-white font-bold text-xl mb-2">Global Infrastructure Nodes</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Physical coordination centers handling distributed agile production workflows globally.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OFFICES.map((office) => (
                <div key={office} className="bg-white/3 border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-indigo-500/30 transition-colors">
                  <MapPin size={20} className="text-indigo-400" />
                  <span className="text-white font-semibold text-sm">{office}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SYSTEM STATUS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "API Gateway", status: "Operational", latency: "12ms", color: "text-emerald-400", dot: "bg-emerald-500" },
            { label: "Lead Pipeline", status: "Live", latency: "Polling 2s", color: "text-sky-400", dot: "bg-sky-500" },
            { label: "Storage Layer", status: "Active", latency: "localStorage", color: "text-indigo-400", dot: "bg-indigo-500" },
          ].map((sys, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${sys.dot} animate-pulse`} />
                <div>
                  <p className="text-white font-medium text-sm">{sys.label}</p>
                  <p className={`text-xs ${sys.color} font-mono`}>{sys.status}</p>
                </div>
              </div>
              <span className="text-slate-600 text-xs font-mono">{sys.latency}</span>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} Digital Byte Solutions — Admin Portal</span>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
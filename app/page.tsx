"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Zap,
  Cloud,
  Shield,
  TrendingUp,
  Search,
  Monitor,
  LayoutDashboard,
  GitBranch,
  Pen,
  Globe,
  Smartphone,
  Rocket,
  Phone,
  MessageCircle,
  User,
  Building2,
  Mail,
  Hash,
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

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Refs for GSAP targets
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── GSAP ScrollTrigger Setup ──
  useEffect(() => {
    if (!mounted) return;

    let ctx: any;

    // Dynamically import GSAP to avoid SSR issues
    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;

        // ── WHITE OVERLAY: 0 → 0.9 → 0 curve tied to scroll ──
        // Peak at ~45% scroll (middle reading sections), back to 0 by 85%
        if (overlayRef.current) {
          ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            onUpdate: (self) => {
              const p = self.progress;
              let opacity = 0;

              if (p < 0.08) {
                // Hero: fully transparent
                opacity = 0;
              } else if (p < 0.45) {
                // Ramp up to 0.9
                opacity = ((p - 0.08) / 0.37) * 0.9;
              } else if (p < 0.72) {
                // Hold near 0.9
                opacity = 0.75;
              } else {
                // Ramp back down to 0 for contact section
                opacity = 0.9 * (1 - (p - 0.72) / 0.28);
              }

              if (overlayRef.current) {
                overlayRef.current.style.opacity = String(Math.min(0.75, Math.max(0, opacity)));
              }
            },
          });
        }

        // ── HERO HEADING: parallax + fade on scroll ──
        if (heroHeadingRef.current) {
          gsap.to(heroHeadingRef.current, {
            y: -80,
            opacity: 0,
            filter: "brightness(0.4)",
            ease: "none",
            scrollTrigger: {
              trigger: heroHeadingRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ── HERO CONTENT: subtle parallax ──
        if (heroContentRef.current) {
          gsap.to(heroContentRef.current, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: heroContentRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, [mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry: ClientInquiry = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      details: formData.message,
      date: new Date().toISOString(),
      status: "New",
      phone: formData.phone,
    };
    try {
      const existing = localStorage.getItem("dbs_leads");
      const leads: ClientInquiry[] = existing ? JSON.parse(existing) : [];
      leads.unshift(inquiry);
      localStorage.setItem("dbs_leads", JSON.stringify(leads));
    } catch (e) {
      console.error("Storage error:", e);
    }
    setSubmitted(true);
    setFormData({ name: "", company: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const progressionCards = [
    {
      num: "01",
      icon: <Pen size={28} className="text-white" />,
      title: "Premium Identity",
      desc: "We design premium brand identities, logos, and visuals that immediately establish market authority.",
      iconBg: "bg-sky-600",
    },
    {
      num: "02",
      icon: <Globe size={28} className="text-sky-600" />,
      title: "Digital Presence",
      desc: "We build interactive, modern websites backed by a strong Google and SEO presence.",
      iconBg: "bg-sky-50/10",
    },
    {
      num: "03",
      icon: <Smartphone size={28} className="text-sky-400" />,
      title: "Custom Platforms",
      desc: "We develop custom applications and platforms tailored exactly to your unique business workflow.",
      iconBg: "bg-sky-50/10",
    },
    {
      num: "04",
      icon: <Rocket size={28} className="text-sky-400" />,
      title: "Revenue Systems",
      desc: "We enable intelligent, automated systems that drive recurring revenue and frictionless scalability.",
      iconBg: "bg-sky-50/10",
    },
  ];

  const growthEngineItems = [
    {
      icon: <Search size={24} className="text-sky-400" />,
      title: "SEO Dominance",
      desc: "Rank on Google & capture market share.",
    },
    {
      icon: <Monitor size={24} className="text-sky-400" />,
      title: "High-Performance Web",
      desc: "Visually stunning, fast websites.",
    },
    {
      icon: <LayoutDashboard size={24} className="text-sky-400" />,
      title: "Smart Dashboards",
      desc: "Custom integrations for complete clarity.",
    },
    {
      icon: <GitBranch size={24} className="text-sky-400" />,
      title: "Automated Workflows",
      desc: "Eliminate manual operations & reporting.",
    },
  ];

  const pillars = [
    { icon: <Zap size={22} className="text-white" />, label: "Built for scalability" },
    { icon: <Cloud size={22} className="text-white" />, label: "Cloud-native architecture" },
    { icon: <Shield size={22} className="text-white" />, label: "Security-first deployment" },
    { icon: <TrendingUp size={22} className="text-white" />, label: "Optimized for performance & ROI" },
  ];

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020813]">

      {/* ══════════════════════════════════════════
          LAYER 1 — PERSISTENT FIXED VIDEO CANVAS
          Sits behind everything on the entire page
      ══════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            // iOS Safari fix: use absolute instead of fixed for the video itself
            transform: "translateZ(0)",
          }}
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        {/* Base dark tint so video never blinds content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(2,8,19,0.7) 0%, rgba(0,20,40,0.6) 50%, rgba(2,8,19,0.75) 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════
          LAYER 2 — SCROLL-DRIVEN WHITE OVERLAY
          Opacity controlled by GSAP onUpdate above
      ══════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="will-change-opacity"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "#ffffff",
          opacity: 0,
          transition: "opacity 0.05s linear",
        }}
      />

      {/* ══════════════════════════════════════════
          LAYER 3 — GRADIENT ATMOSPHERE
      ══════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(6,182,212,0.10) 0%, rgba(56,189,248,0.05) 45%, transparent 70%)",
        }}
      />

      {/* ══════════════════════════════════════════
          ALL PAGE CONTENT — z-index 10+
      ══════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── FIXED NAV ── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">DB</span>
              </div>
              <span className="text-white font-bold text-sm tracking-wide hidden sm:block">
                Digital Byte
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-300 hover:text-white text-sm transition-colors">Services</a>
              <a href="#process" className="text-slate-300 hover:text-white text-sm transition-colors">Process</a>
              <a href="#contact" className="text-slate-300 hover:text-white text-sm transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm transition-colors hidden sm:block">
                Client Portal
              </Link>
              <a
                href="#contact"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Scanlines texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)",
            }}
          />

          {/* Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: (i % 3 === 0 ? 2 : 1) + "px",
                  height: (i % 3 === 0 ? 2 : 1) + "px",
                  top: ((i * 37 + 13) % 100) + "%",
                  left: ((i * 53 + 7) % 100) + "%",
                  opacity: 0.10 + (i % 5) * 0.07,
                }}
              />
            ))}
          </div>

          {/* HERO CONTENT — Layer 4 */}
          <div
            ref={heroContentRef}
            className="relative w-full flex flex-col items-center justify-center px-6 py-32 will-change-transform"
            style={{ zIndex: 2 }}
          >
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 mb-10 flex flex-col items-center"
            >
              <div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 via-violet-500 to-purple-600 flex items-center justify-center mb-3"
                style={{
                  boxShadow: "0 0 48px rgba(6,182,212,0.40), 0 8px 32px rgba(0,0,0,0.55)",
                }}
              >
                <span className="text-white font-black text-2xl">DB</span>
              </div>
              <p className="text-white/60 text-xs tracking-[0.3em] font-light uppercase">
                Digital Byte Solutions
              </p>
            </motion.div>

            {/* Headline — GSAP controls scroll behaviour, Framer Motion handles load-in */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10"
            >
              <h1
                ref={heroHeadingRef}
                className="will-change-transform text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none mb-6"
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  textShadow: "0 2px 40px rgba(0,0,0,0.75)",
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="text-sky-400">Empower</span>ing
                <br />
                Your Visi<span className="text-sky-400">o</span>n.
              </h1>
              <p
                className="text-slate-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
                style={{ textShadow: "0 1px 16px rgba(0,0,0,0.85)" }}
              >
                Whether it&apos;s an App, Website, Software, or SaaS — we understand your needs
                and build intelligent tech built to scale.
              </p>
            </motion.div>

            {/* CTA Buttons — Layer 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 flex flex-wrap items-center justify-center gap-4 mb-16"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                  color: "#fff",
                  boxShadow: "0 0 28px rgba(14,165,233,0.45), 0 4px 20px rgba(0,0,0,0.45)",
                }}
              >
                Start Your Project
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(15,23,42,0.75)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(14,165,233,0.40)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                Explore Services
              </a>
            </motion.div>

            {/* Scroll Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="relative z-10 flex flex-col items-center gap-2 text-slate-200"
            >
              <span className="text-xs tracking-[0.25em] font-medium uppercase">
                Scroll To Initiate Scale
              </span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <ChevronDown size={20} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── FLOATING FEATURE BOARD ──
            Glassmorphism: backdrop-blur + semi-transparent bg
            Video is visible through it when overlay is low */}
        <section id="services" className="relative z-10 px-4 md:px-8 -mt-4 pb-0">
          <div
            className="max-w-5xl mx-auto rounded-[40px] px-8 md:px-12 py-12"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2) inset",
            }}
          >
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {["Custom Apps & Web", "SaaS & Software", "Official Cloud Partner", "AI-First SEO"].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-slate-700 text-sm font-medium"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-center mb-10">
              <h2
                className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Your Vision.
                <br />
                Our Tech.
                <br />
                <span className="text-sky-600">Built to Scale.</span>
              </h2>
            </div>

            <div className="flex justify-center">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-8 py-4 rounded-full text-base transition-all"
              >
                Execute your Vision
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* ── PILLAR ROW ── Glassmorphic, no hard white bg */}
        <section className="relative z-10 mt-16">
          <div className="max-w-5xl mx-auto px-4">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-x"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.4)",
                divideColor: "rgba(148,163,184,0.3)",
              }}
            >
              {pillars.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-3 py-10 px-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <p className="text-slate-800 font-semibold text-sm text-center">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GROWTH ENGINE ── Glassmorphic panel */}
        <section id="process" className="relative z-10 px-4 md:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-[32px] p-10 md:p-14"
              style={{
                background: "rgba(255,255,255,0.68)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <p className="text-sky-600 text-xs font-bold tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                    <span className="w-6 h-px bg-sky-600 inline-block" />
                    The Growth Engine
                  </p>
                  <h2
                    className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    Start To Scale.
                  </h2>
                  <p className="text-slate-600 font-medium mb-3">
                    We upgrade brand presence from foundational to dominant.
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Our intelligent systems and tailored strategies are designed to transform
                    operations, automate reporting, and drive measurable market growth.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {growthEngineItems.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-5 hover:border-sky-300 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(14,165,233,0.15)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                        {item.icon}
                      </div>
                      <h3 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROGRESSION STEPS ── */}
        <section className="relative z-10 px-4 md:px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sky-500 text-xs font-bold tracking-[0.3em] uppercase mb-3 drop-shadow-sm">
                The Progression
              </p>
              <h2
                className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                From Launch To{" "}
                <span className="text-sky-400">Market Dominance.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {progressionCards.map((card, i) => (
                <div
                  key={i}
                  className="relative rounded-3xl p-6 overflow-hidden transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="absolute top-2 right-3 text-7xl font-black text-white/5 select-none pointer-events-none leading-none">
                    {card.num}
                  </span>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{card.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM ── */}
        <section
          id="contact"
          className="relative z-10 px-4 md:px-8 py-20"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sky-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
                Get In Touch
              </p>
              <h2
                className="text-4xl md:text-5xl font-extrabold text-white"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Let&apos;s Build The{" "}
                <span className="text-sky-400">Future.</span>
              </h2>
              <p className="text-slate-200 mt-3 text-sm">
                Share your requirements and we&apos;ll get back within 24 hours.
              </p>
            </div>

            <div
              className="rounded-[40px] p-8 md:p-10"
              style={{
                background: "rgba(15,23,42,0.75)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)",
              }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mb-4">
                      <ArrowUpRight size={32} className="text-sky-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Message Received!</h3>
                    <p className="text-slate-200 text-sm">
                      Your inquiry has been synced to our dashboard. We&apos;ll respond within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 1 }} onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">
                          <User size={12} /> Full Name
                        </label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder="e.g. John Doe" required
                          className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">
                          <Building2 size={12} /> Organization
                        </label>
                        <input
                          type="text" name="company" value={formData.company} onChange={handleChange}
                          placeholder="e.g. Digital Bytes Solutions"
                          className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">
                          <Mail size={12} /> Email Address
                        </label>
                        <input
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="john@example.com" required
                          className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">
                          <Hash size={12} /> Contact Number
                        </label>
                        <input
                          type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="flex items-center gap-2 text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">
                        <MessageCircle size={12} /> Message
                      </label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        placeholder="Tell us about your project requirements..."
                        rows={4} required
                          className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                        className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors resize-none"

                    >
                      Send Message
                      <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

{/* Offices */}
<div className="max-w-6xl mx-auto mt-20 text-center">
  <p className="text-slate-300 text-xs tracking-[0.35em] uppercase mb-8 font-semibold">
    Offices In
  </p>

  <div className="flex flex-wrap justify-center gap-5 mb-8">
    {["Dehradun", "Pune", "Mumbai", "Australia"].map((city) => (
      <div
        key={city}
        className="px-8 py-4 rounded-full"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
        }}
      >
        <span className="text-white font-semibold tracking-wide">
          📍 {city.toUpperCase()}
        </span>
      </div>
    ))}
  </div>

  <div
    className="inline-flex items-center gap-3 px-10 py-5 rounded-full"
    style={{
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
    }}
  >
    <Globe size={20} className="text-sky-400" />
    <span className="text-white font-semibold tracking-[0.15em] uppercase">
      Scaling Remotely Worldwide
    </span>
  </div>
</div>
        </section>

        {/* ── BOTTOM CALL RIBBON ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1aa394] py-3 flex items-center justify-center gap-3">
          <Phone size={16} className="text-white" />
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            Call Now At +91-9821199832
          </span>
        </div>

        {/* ── WHATSAPP BUBBLE ── */}
        <a
          href="https://wa.me/919821199832"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-16 right-5 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        >
          <MessageCircle size={24} className="text-emerald-500" />
        </a>

      </div>
    </main>
  );
}
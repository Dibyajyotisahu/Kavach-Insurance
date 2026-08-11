import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, ShieldCheck, Bike, Smartphone, Activity, ChevronDown, ChevronLeft, ChevronRight,
  ArrowRight, CheckCircle2, Wrench, Stethoscope, HeartPulse, Users,
  FileText, LifeBuoy, Coins, MapPin, Camera, ClipboardCheck,
  BadgeCheck, Building2, Truck, Car, Briefcase, Zap, Lock, Sparkles, Send,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

/* ---------------------------------------------------------------
   TOKENS
   ink #120D08 · paper #FFFFFF · signal(route-green) #FF7A00
   amber(helmet) #0EA5A0 · muted(slate) #4A3B2E · hairline #E4DACB
----------------------------------------------------------------*/

const fmtINR = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

/* ---------------------------------------------------------------
   HOOKS: reveal-on-scroll, count-up, tilt, scroll-spy
----------------------------------------------------------------*/
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, className = "", delay = 0, y = 24 }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

function CountUp({ value, prefix = "", suffix = "", duration = 900 }) {
  const [ref, inView] = useInView(0.4);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    let start = null;
    const from = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function useTilt(strength = 6) {
  const ref = useRef(null);
  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-2px)`;
    },
    [strength]
  );
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function Eyebrow({ n, label, tone = "signal" }) {
  const color = tone === "amber" ? "text-[#0EA5A0]" : "text-[#FF7A00]";
  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-5">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full ${tone === "amber" ? "bg-[#0EA5A0]" : "bg-[#FF7A00]"} opacity-40 animate-ping`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${tone === "amber" ? "bg-[#0EA5A0]" : "bg-[#FF7A00]"}`} />
        </span>
        <span className={`font-mono text-xs tracking-[0.2em] uppercase ${color}`}>Stop {n}</span>
        <span className="h-px flex-1 max-w-16 bg-current opacity-20" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#4A3B2E]">{label}</span>
      </div>
    </Reveal>
  );
}

function SectionWrap({ id, className = "", children }) {
  return (
    <section id={id} className={`relative px-6 md:px-12 lg:px-20 py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

const ROUTE_STOPS = [
  { id: "top", n: "•", label: "Home" },
  { id: "the-problem", n: "01", label: "The Problem" },
  { id: "how-it-works", n: "02", label: "The Solution" },
  { id: "protection", n: "03", label: "Plans" },
  { id: "bank-vs-us", n: "04", label: "Bank vs Us" },
  { id: "what-you-can-claim", n: "05", label: "Claimable Events" },
  { id: "claims", n: "06", label: "Claim Process" },
  { id: "dashboard", n: "07", label: "Dashboard" },
  { id: "for-workers", n: "08", label: "For Workers" },
  { id: "why-us", n: "09", label: "Why Us" },
  { id: "testimonials", n: "10", label: "Stories" },
  { id: "partners", n: "11", label: "Partners" },
  { id: "faq", n: "12", label: "FAQ" },
];

/* ---------------------------------------------------------------
   ROUTE RAIL — floating scroll-spy waypoint nav (desktop)
----------------------------------------------------------------*/
function RouteRail() {
  const ids = ROUTE_STOPS.map((s) => s.id);
  const active = useScrollSpy(ids);
  return (
    <div className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0.5 rounded-full bg-[#120D08]/95 border border-white/10 py-4 px-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      {ROUTE_STOPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <a href={`#${s.id}`} className="group relative flex items-center justify-center h-5 w-5">
            <span
              className={`rounded-full transition-all duration-300 ${
                active === s.id ? "h-2.5 w-2.5 bg-[#FF7A00] shadow-[0_0_10px_#FF7A00]" : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50"
              }`}
            />
            <span className="pointer-events-none absolute left-6 whitespace-nowrap rounded-md bg-[#120D08] border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide text-white/80 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              {s.label}
            </span>
          </a>
          {i < ROUTE_STOPS.length - 1 && (
            <span className={`w-px h-3.5 ${active === s.id ? "bg-[#FF7A00]/50" : "bg-white/10"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   NAVBAR
----------------------------------------------------------------*/
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navIds = ["how-it-works", "protection", "bank-vs-us", "for-workers", "claims", "faq"];
  const active = useScrollSpy(navIds);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["How It Works", "Protection", "Bank vs Us", "For Workers & Students", "Claims", "FAQ"];
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#120D08]/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-[#FF7A00] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12">
            <ShieldCheck className="h-5 w-5 text-[#120D08]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-white tracking-tight text-lg">Kavach</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => {
            const id = l.toLowerCase().replace(/\s+/g, "-");
            const isActive = active === id;
            return (
              <a
                key={l}
                href={`#${id}`}
                className={`relative text-sm transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-[#FF7A00] after:transition-all ${
                  isActive ? "text-white after:w-full" : "text-white/70 hover:text-white after:w-0 hover:after:w-full"
                }`}
              >
                {l}
              </a>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <a href="#login" className="text-sm text-white/70 hover:text-white transition-colors">Login</a>
          <a href="#plans" className="inline-flex items-center gap-1.5 bg-[#FF7A00] text-[#120D08] text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#FF9433] hover:scale-[1.04] active:scale-[0.97] transition-all">
            Get Protected — ₹1/day
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-[#120D08] border-t border-white/10 ${open ? "max-h-96" : "max-h-0 border-t-0"}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setOpen(false)} className="text-white/80 text-base">
              {l}
            </a>
          ))}
          <a href="#login" className="text-white/80 text-base">Login</a>
          <a href="#plans" onClick={() => setOpen(false)} className="mt-2 text-center bg-[#FF7A00] text-[#120D08] font-semibold px-4 py-3 rounded-full">
            Get Protected — ₹1/day
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------
   HERO — cursor spotlight, parallax blobs, floating coins
----------------------------------------------------------------*/
function Hero() {
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const wrapRef = useRef(null);
  const onMove = (e) => {
    const r = wrapRef.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const coins = [
    { left: "8%", delay: "0s", size: 18 },
    { left: "22%", delay: "1.4s", size: 12 },
    { left: "76%", delay: "0.6s", size: 16 },
    { left: "88%", delay: "2.1s", size: 12 },
    { left: "55%", delay: "3s", size: 14 },
  ];
  return (
    <section id="top" ref={wrapRef} onMouseMove={onMove} className="relative overflow-hidden bg-[#120D08] text-white pt-16 pb-24 md:pb-32">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 hidden md:block"
        style={{ background: `radial-gradient(560px circle at ${pos.x}% ${pos.y}%, rgba(255,122,0,0.12), transparent 45%)` }}
      />
      <div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#FF7A00] opacity-[0.12] blur-[100px] transition-transform duration-700 ease-out"
        style={{ transform: `translate(${(pos.x - 50) * 0.15}px, ${(pos.y - 50) * 0.15}px)` }}
      />
      <div
        className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-[#0EA5A0] opacity-[0.08] blur-[100px] transition-transform duration-700 ease-out"
        style={{ transform: `translate(${(pos.x - 50) * -0.1}px, ${(pos.y - 50) * -0.1}px)` }}
      />

      {coins.map((c, i) => (
        <span
          key={i}
          className="absolute bottom-10 font-mono text-[#FF7A00]/40 select-none pointer-events-none coin-float"
          style={{ left: c.left, fontSize: c.size, animationDelay: c.delay }}
        >
          ₹
        </span>
      ))}

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
              <span className="text-xs font-mono tracking-wide text-white/70">BUILT FOR INDIA'S GIG ECONOMY & STUDENTS</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-[#FF7A00]">₹1 a day.</span>
              <br />
              Protection built for
              <br className="hidden md:block" /> gig workers.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg text-white/60 max-w-md mb-10 leading-relaxed">
              Affordable financial protection designed for delivery partners, drivers, freelancers and workers whose income depends on staying on the road.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#plans" className="inline-flex items-center justify-center gap-2 bg-[#FF7A00] text-[#120D08] font-semibold px-6 py-3.5 rounded-full hover:bg-[#FF9433] hover:scale-[1.03] active:scale-[0.97] transition-all">
                Protect Me for ₹1/day <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-full hover:bg-white/5 hover:border-white/40 transition-all">
                See How It Works
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-6 text-xs text-white/35 max-w-md">*Benefits depend on the selected product/policy terms, eligibility and covered events.</p>
          </Reveal>
        </div>

        <Reveal delay={200} y={36}>
          <div className="relative rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="flex flex-col items-center py-6">
              <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-[#FF7A00]/20 to-[#0EA5A0]/10 flex items-center justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-[#120D08] border-2 border-[#FF7A00]/40 flex items-center justify-center animate-[spin_18s_linear_infinite]">
                  <Bike className="h-12 w-12 text-[#FF7A00] -rotate-90" strokeWidth={1.5} style={{ transform: "rotate(0deg)" }} />
                </div>
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-[#0EA5A0] flex items-center justify-center shadow-lg shadow-[#0EA5A0]/25 animate-bounce" style={{ animationDuration: "2.4s" }}>
                  <ShieldCheck className="h-5 w-5 text-[#120D08]" />
                </div>
              </div>
              <p className="font-mono text-sm text-white/50">Delivery Partner · On Route</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Coins, label: "₹1/day", sub: "Contribution" },
                { icon: FileText, label: "₹365/yr", sub: "Total / year" },
                { icon: ShieldCheck, label: "Up to ₹5,000*", sub: "Eligible protection" },
                { icon: Smartphone, label: "Digital claims", sub: "In-app filing" },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 hover:bg-white/[0.08] hover:-translate-y-0.5 hover:border-[#FF7A00]/30 transition-all cursor-default">
                  <c.icon className="h-4 w-4 text-[#FF7A00] mb-2" />
                  <div className="font-semibold text-sm text-white">{c.label}</div>
                  <div className="text-xs text-white/40">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   TRUST STRIP
----------------------------------------------------------------*/
function TrustStrip() {
  const items = [
    { icon: Truck, label: "Delivery Partners" },
    { icon: Car, label: "Drivers" },
    { icon: Briefcase, label: "Freelancers" },
    { icon: Coins, label: "Daily-Income Workers" },
    { icon: Building2, label: "Small Businesses" },
  ];
  return (
    <div className="bg-[#120D08] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        <Reveal>
          <p className="text-center font-mono text-xs tracking-[0.2em] uppercase text-white/35 mb-8">Built for gig workers & students</p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="flex flex-col items-center gap-2 text-center py-4 rounded-xl hover:bg-white/[0.05] hover:-translate-y-1 transition-all">
                <it.icon className="h-5 w-5 text-white/60" strokeWidth={1.5} />
                <span className="text-xs text-white/50">{it.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PROBLEM
----------------------------------------------------------------*/
function Problem() {
  const cards = [
    { icon: Wrench, title: "Bike damaged", body: "A repair bill arrives — and until it's paid, you're off the road." },
    { icon: Smartphone, title: "Phone damaged", body: "A cracked screen means no orders, no navigation, no income." },
    { icon: HeartPulse, title: "An accident", body: "Medical expenses arrive at the same moment your income stops." },
  ];
  return (
    <SectionWrap id="the-problem" className="bg-[#FFFFFF]">
      <Eyebrow n="01" label="The Problem" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-4">When you can't work, your income stops.</h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-[#4A3B2E] max-w-xl mb-14 leading-relaxed">For millions of gig workers, one unexpected expense can become a financial crisis.</p>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const tilt = useTilt(5);
          return (
            <Reveal key={i} delay={i * 100}>
              <div {...tilt} className="rounded-3xl bg-white border border-[#E4DACB] p-7 hover:shadow-[0_16px_40px_rgba(11,28,44,0.10)] transition-shadow duration-300 [transform-style:preserve-3d]">
                <div className="h-11 w-11 rounded-xl bg-[#0EA5A0]/10 flex items-center justify-center mb-5">
                  <c.icon className="h-5 w-5 text-[#0EA5A0]" />
                </div>
                <h3 className="font-semibold text-[#120D08] mb-2">{c.title}</h3>
                <p className="text-sm text-[#4A3B2E] leading-relaxed">{c.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={200}>
        <div className="mt-12 rounded-3xl bg-[#120D08] px-8 py-10 text-center">
          <p className="text-xl md:text-2xl font-semibold text-white">Your income depends on your ability to work.</p>
        </div>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   SOLUTION
----------------------------------------------------------------*/
function Solution() {
  const flow = [
    { label: "₹1 / day", icon: Coins },
    { label: "₹365 / year", icon: FileText },
    { label: "Protection for eligible events", icon: ShieldCheck },
    { label: "Digital claims", icon: Smartphone },
    { label: "The benefit you're entitled to", icon: BadgeCheck },
  ];
  return (
    <SectionWrap id="how-it-works" className="bg-white">
      <Eyebrow n="02" label="The Solution" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-4">That's why we built Kavach.</h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-[#4A3B2E] max-w-xl mb-14 leading-relaxed">
          For approximately ₹1 a day, eligible gig workers can access affordable protection designed around the risks they face every day.
        </p>
      </Reveal>

      <div className="flex flex-col md:flex-row items-stretch gap-3">
        {flow.map((f, i) => (
          <React.Fragment key={i}>
            <Reveal delay={i * 90} className="flex-1">
              <div className="h-full rounded-2xl border border-[#E4DACB] bg-[#FFFFFF] p-5 flex flex-col items-center text-center gap-3 hover:border-[#FF7A00]/40 hover:bg-[#FF7A00]/[0.04] hover:-translate-y-1 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-[#FF7A00]/15 flex items-center justify-center">
                  <f.icon className="h-4.5 w-4.5 text-[#FF7A00]" />
                </div>
                <span className="text-sm font-medium text-[#120D08]">{f.label}</span>
              </div>
            </Reveal>
            {i < flow.length - 1 && (
              <div className="hidden md:flex items-center justify-center text-[#FF7A00]">
                <ArrowRight className="h-4 w-4 animate-arrow-nudge" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <Reveal delay={300}>
        <div className="mt-10">
          <a href="#plans" className="inline-flex items-center gap-2 text-[#120D08] font-semibold border-b-2 border-[#FF7A00] pb-1 hover:gap-3 transition-all">
            Explore Protection <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   PLANS
----------------------------------------------------------------*/
function PlanCard({ p, i }) {
  const tilt = useTilt(4);
  return (
    <Reveal delay={i * 110} y={30}>
      <div
        {...tilt}
        className={`relative rounded-3xl bg-white border-2 ${p.tone} p-7 flex flex-col h-full [transform-style:preserve-3d] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(11,28,44,0.12)] ${
          p.featured ? "md:-translate-y-3 shadow-[0_16px_40px_rgba(11,28,44,0.10)] plan-glow" : ""
        }`}
      >
        {p.featured && <span className="absolute -top-3 left-7 bg-[#FF7A00] text-[#120D08] text-xs font-bold px-3 py-1 rounded-full">MOST CHOSEN</span>}
        <h3 className="font-semibold text-lg text-[#120D08] mb-1">{p.name}</h3>
        <p className="text-sm text-[#4A3B2E] mb-5">{p.desc}</p>
        <div className="mb-1">
          <span className="text-3xl font-bold text-[#120D08] font-mono">{p.price}</span>
        </div>
        <p className="text-xs text-[#4A3B2E] font-mono mb-6">{p.yr}</p>
        <div className="rounded-2xl bg-[#120D08] px-4 py-3 mb-6">
          <p className="text-[10px] uppercase tracking-wide text-white/40 font-mono">Potential maximum benefit</p>
          <p className="text-xl font-bold text-[#FF7A00] font-mono">
            Up to <CountUp value={p.benefitNum} prefix="₹" />*
          </p>
        </div>
        <ul className="space-y-2.5 mb-8 flex-1">
          {p.features.map((f, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-[#120D08]/80">
              <CheckCircle2 className="h-4 w-4 text-[#FF7A00] mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="#claims"
          className={`text-center font-semibold px-5 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] ${
            p.featured ? "bg-[#FF7A00] text-[#120D08] hover:bg-[#FF9433]" : "bg-[#120D08] text-white hover:bg-[#1F160D]"
          }`}
        >
          {p.cta}
        </a>
      </div>
    </Reveal>
  );
}

function Plans() {
  const plans = [
    {
      name: "Basic", price: "₹1/day", yr: "₹365/year", benefitNum: 5000,
      desc: "Suitable for workers and students looking for basic protection.",
      features: ["Accident-related protection", "Eligible damage protection", "Digital claims assistance", "Policy dashboard", "24/7 support"],
      tone: "border-[#E4DACB]", cta: "Choose Basic", featured: false,
    },
    {
      name: "Plus", price: "₹2/day", yr: "₹730/year", benefitNum: 10000,
      desc: "Higher protection limits for workers and students who want more coverage.",
      features: ["Higher accident protection", "Higher eligible damage protection", "Hospital-related benefits where applicable", "Income-support benefits where applicable", "Digital claims", "Priority support"],
      tone: "border-[#FF7A00]", cta: "Choose Plus", featured: true,
    },
    {
      name: "Pro", price: "₹5/day", yr: "₹1,825/year", benefitNum: 25000,
      desc: "For workers and students who want broader protection.",
      features: ["Higher protection limits", "Accident protection", "Eligible equipment/bike protection", "Hospital benefits where applicable", "Income protection where applicable", "Priority claims support"],
      tone: "border-[#E4DACB]", cta: "Choose Pro", featured: false,
    },
  ];
  return (
    <SectionWrap id="protection" className="bg-[#FFFFFF]">
      <Eyebrow n="03" label="Protection Plans" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">Plans built around real gig-worker risk.</h2>
      </Reveal>
      <div id="plans" className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <PlanCard key={i} p={p} i={i} />
        ))}
      </div>
      <Reveal delay={200}>
        <p className="mt-8 text-xs text-[#4A3B2E] max-w-2xl">*Illustrative benefits. Final coverage, exclusions, limits and eligibility depend on the approved insurance/product terms.</p>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   CALCULATOR — Bank vs Us
----------------------------------------------------------------*/
function Row({ label, value, numeric, strong, accent }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className={`font-mono text-sm ${strong ? "font-bold text-base" : ""} ${accent ? "text-[#FF7A00]" : "text-white"}`}>
        {typeof numeric === "number" ? <CountUp value={numeric} prefix="₹" duration={500} /> : value}
      </span>
    </div>
  );
}

function Calculator() {
  const [daily, setDaily] = useState(1);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(2.5);
  const [workers, setWorkers] = useState(1);
  const protectionLimit = 5000;

  const result = useMemo(() => {
    const annualContribution = daily * 365 * workers;
    let balance = 0;
    for (let y = 0; y < years; y++) balance = (balance + annualContribution) * (1 + rate / 100);
    const totalContributions = annualContribution * years;
    const interestEarned = balance - totalContributions;
    const maxEligibleBenefit = protectionLimit * workers;
    return { totalContributions, interestEarned, balance, maxEligibleBenefit };
  }, [daily, years, rate, workers]);

  const chartData = [
    { name: "Total contribution", Bank: Math.round(result.totalContributions), Protection: Math.round(result.totalContributions) },
    { name: "Bank: est. balance", Bank: Math.round(result.balance), Protection: 0 },
    { name: "Max eligible benefit*", Bank: 0, Protection: result.maxEligibleBenefit },
  ];

  return (
    <SectionWrap id="bank-vs-us" className="bg-[#120D08] text-white">
      <Eyebrow n="04" label="Bank vs Us" tone="amber" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl mb-4">What if you put ₹1/day somewhere else?</h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-white/50 max-w-2xl mb-12 leading-relaxed">
          A savings account is designed to grow your money. Protection is designed to transfer financial risk. The protection amount is not a guaranteed investment return — it's paid only for eligible covered events.
        </p>
      </Reveal>

      <div className="grid lg:grid-cols-[340px_1fr] gap-8">
        <Reveal delay={120}>
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 space-y-6 h-fit sticky top-24">
            {[
              { label: "Daily amount", value: daily, set: setDaily, min: 1, max: 10, step: 1, fmt: (v) => `₹${v}` },
              { label: "Number of years", value: years, set: setYears, min: 1, max: 20, step: 1, fmt: (v) => `${v} yr` },
              { label: "Savings interest rate", value: rate, set: setRate, min: 0, max: 8, step: 0.5, fmt: (v) => `${v}%` },
              { label: "Number of workers", value: workers, set: setWorkers, min: 1, max: 100, step: 1, fmt: (v) => `${v}` },
            ].map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wide text-white/50">{f.label}</label>
                  <span className="text-sm font-mono text-[#FF7A00] transition-all">{f.fmt(f.value)}</span>
                </div>
                <input
                  type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full accent-[#FF7A00] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Reveal delay={160}>
              <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 h-full hover:border-white/20 transition-colors">
                <p className="text-xs font-mono uppercase tracking-wide text-white/40 mb-4">Bank savings account</p>
                <Row label="Total contributions" numeric={result.totalContributions} />
                <Row label="Estimated interest" numeric={result.interestEarned} />
                <Row label="Estimated final balance" numeric={result.balance} strong />
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="rounded-3xl bg-white/[0.04] border border-[#FF7A00]/30 p-6 h-full hover:border-[#FF7A00]/50 transition-colors">
                <p className="text-xs font-mono uppercase tracking-wide text-[#FF7A00]/70 mb-4">Protection plan</p>
                <Row label="Total contribution" numeric={result.totalContributions} />
                <Row label="Covered events" value="Accident, damage, hospitalization*" />
                <Row label="Max eligible protection benefit" numeric={result.maxEligibleBenefit} strong accent />
              </div>
            </Reveal>
          </div>

          <Reveal delay={280}>
            <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#ffffff80", fontSize: 11 }} axisLine={{ stroke: "#ffffff20" }} tickLine={false} />
                  <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? v / 1000 + "k" : v}`} />
                  <Tooltip contentStyle={{ background: "#120D08", border: "1px solid #ffffff20", borderRadius: 12, fontSize: 12 }} formatter={(v) => fmtINR(v)} cursor={{ fill: "#ffffff08" }} />
                  <Bar dataKey="Bank" radius={[8, 8, 0, 0]} animationDuration={600}>
                    {chartData.map((_, i) => <Cell key={i} fill="#0EA5A0" />)}
                  </Bar>
                  <Bar dataKey="Protection" radius={[8, 8, 0, 0]} animationDuration={600}>
                    {chartData.map((_, i) => <Cell key={i} fill="#FF7A00" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="overflow-x-auto rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04] text-white/50 font-mono text-xs uppercase">
                    <th className="text-left px-5 py-3">{""}</th>
                    <th className="text-left px-5 py-3">Bank Savings</th>
                    <th className="text-left px-5 py-3">Protection Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    ["Main purpose", "Save money", "Protect against covered risks"],
                    ["Money growth", "Yes", "Not the primary purpose"],
                    ["Risk protection", "No / limited", "Yes"],
                    ["Claim benefit", "No", "Yes, for covered events"],
                    ["₹1/day", "Builds savings", "Pays premium / contribution"],
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3 text-white/60">{r[0]}</td>
                      <td className="px-5 py-3 text-white">{r[1]}</td>
                      <td className="px-5 py-3 text-white">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="text-xs text-white/35">*Illustrative. Max eligible protection benefit is a per-claim/plan cap, not a cumulative balance, and is payable only for eligible covered events subject to policy terms.</p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   ONE RUPEE VISUAL
----------------------------------------------------------------*/
function OneRupee() {
  return (
    <SectionWrap className="bg-[#FFFFFF] text-center">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute h-32 w-32 rounded-full bg-[#FF7A00]/10 animate-pulse" />
            <span className="relative text-8xl font-bold text-[#120D08] font-mono coin-bob">₹1</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#120D08] mb-8">That's all it takes to start.</h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-mono text-[#4A3B2E] mb-8">
            <span className="rounded-full bg-white border border-[#E4DACB] px-4 py-2 hover:border-[#FF7A00]/40 hover:text-[#120D08] transition-colors">₹1</span>
            <span>=</span>
            <span className="rounded-full bg-white border border-[#E4DACB] px-4 py-2 hover:border-[#FF7A00]/40 hover:text-[#120D08] transition-colors">tea-sized daily contribution</span>
            <span>=</span>
            <span className="rounded-full bg-white border border-[#E4DACB] px-4 py-2 hover:border-[#FF7A00]/40 hover:text-[#120D08] transition-colors">₹365/year</span>
            <span>=</span>
            <span className="rounded-full bg-[#120D08] text-white px-4 py-2">affordable protection</span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-[#4A3B2E] leading-relaxed">We believe financial protection shouldn't be available only to people with high incomes.</p>
        </Reveal>
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   CLAIMABLE EVENTS
----------------------------------------------------------------*/
function ClaimableEvents() {
  const items = [
    { icon: Activity, title: "Accident", body: "Protection for eligible accident-related events." },
    { icon: Bike, title: "Bike / Scooter Damage", body: "Protection for eligible covered damage." },
    { icon: Smartphone, title: "Phone / Device Damage", body: "Protection for eligible covered equipment." },
    { icon: Stethoscope, title: "Hospitalization", body: "Eligible medical/hospital benefits depending on the selected plan." },
    { icon: HeartPulse, title: "Temporary Disability", body: "Benefits may apply when a covered event temporarily prevents you from working." },
    { icon: ShieldCheck, title: "Permanent Disability", body: "Eligible disability benefits according to policy terms." },
    { icon: Users, title: "Accidental Death", body: "Eligible benefit paid to the nominee." },
  ];
  return (
    <SectionWrap id="what-you-can-claim" className="bg-white">
      <Eyebrow n="05" label="Claimable Events" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">What can you claim?</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => {
          const tilt = useTilt(5);
          return (
            <Reveal key={i} delay={(i % 3) * 90}>
              <div {...tilt} className="rounded-3xl border border-[#E4DACB] p-6 hover:border-[#FF7A00]/40 hover:shadow-[0_16px_40px_rgba(11,28,44,0.10)] transition-shadow duration-300 [transform-style:preserve-3d] h-full">
                <div className="h-10 w-10 rounded-xl bg-[#120D08] flex items-center justify-center mb-4">
                  <it.icon className="h-5 w-5 text-[#FF7A00]" />
                </div>
                <h3 className="font-semibold text-[#120D08] mb-1.5">{it.title}</h3>
                <p className="text-sm text-[#4A3B2E] mb-3 leading-relaxed">{it.body}</p>
                <p className="text-[10px] uppercase tracking-wide text-[#0EA5A0] font-mono">Subject to policy terms &amp; eligibility</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   CLAIM PROCESS
----------------------------------------------------------------*/
function ClaimProcess() {
  const steps = [
    { icon: MapPin, title: "Report", body: "Open the app and report the incident." },
    { icon: Camera, title: "Verify", body: "Upload the required documents and photos." },
    { icon: ClipboardCheck, title: "Resolve", body: "The claim is reviewed according to applicable policy terms." },
  ];
  return (
    <SectionWrap id="claims" className="bg-[#FFFFFF]">
      <Eyebrow n="06" label="Claim Process" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">3 steps to make a claim.</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 110}>
            <div className="rounded-3xl bg-white border border-[#E4DACB] p-7 relative h-full hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(11,28,44,0.10)] transition-all duration-300">
              <span className="font-mono text-xs text-[#FF7A00] mb-4 block">0{i + 1}</span>
              <div className="h-11 w-11 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center mb-5">
                <s.icon className="h-5 w-5 text-[#FF7A00]" />
              </div>
              <h3 className="font-semibold text-[#120D08] mb-2">{s.title}</h3>
              <p className="text-sm text-[#4A3B2E] leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={340}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#4A3B2E] mb-8">
          {["Incident", "Claim", "Verification", "Decision", "Eligible payout"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className="rounded-full bg-white border border-[#E4DACB] px-4 py-2">{s}</span>
              {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#FF7A00]" />}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
      <Reveal delay={400}>
        <p className="text-lg font-semibold text-[#120D08]">No confusing paperwork. No unnecessary trips.</p>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   DASHBOARD PREVIEW — interactive tabs
----------------------------------------------------------------*/
function DashboardPreview() {
  const tabs = [
    {
      key: "report", label: "Report an Incident", icon: MapPin,
      panel: (
        <div className="grid sm:grid-cols-3 gap-3">
          {["What happened?", "Add photos", "Submit report"].map((s, i) => (
            <div key={s} className="rounded-xl bg-white/[0.05] border border-white/10 p-4">
              <span className="font-mono text-[10px] text-[#FF7A00]">STEP 0{i + 1}</span>
              <p className="text-sm mt-1">{s}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "protection", label: "My Protection", icon: ShieldCheck,
      panel: (
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/[0.05] border border-white/10 p-4"><p className="text-xs text-white/40">Plan</p><p className="font-mono font-bold">Basic</p></div>
          <div className="rounded-xl bg-white/[0.05] border border-white/10 p-4"><p className="text-xs text-white/40">Coverage</p><p className="font-mono font-bold text-[#FF7A00]">Up to ₹5,000</p></div>
          <div className="rounded-xl bg-white/[0.05] border border-white/10 p-4"><p className="text-xs text-white/40">Status</p><p className="font-mono font-bold">Active</p></div>
        </div>
      ),
    },
    {
      key: "status", label: "Claim Status", icon: ClipboardCheck,
      panel: (
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {["Submitted", "Documents verified", "Under review", "Decision"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className={`rounded-full px-3 py-1.5 border ${i < 2 ? "bg-[#FF7A00]/15 border-[#FF7A00]/40 text-[#FF7A00]" : "bg-white/5 border-white/10 text-white/50"}`}>{s}</span>
              {i < arr.length - 1 && <span className="text-[#FF7A00]">→</span>}
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      key: "documents", label: "Documents", icon: FileText,
      panel: (
        <div className="flex flex-wrap gap-2">
          {["Policy PDF", "ID proof", "Incident photos", "Claim form"].map((d) => (
            <span key={d} className="rounded-full bg-white/[0.05] border border-white/10 px-3 py-1.5 text-xs">{d}</span>
          ))}
        </div>
      ),
    },
    {
      key: "support", label: "Support", icon: LifeBuoy,
      panel: (
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] border border-white/10 p-4">
          <input placeholder="Ask us anything…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30" />
          <Send className="h-4 w-4 text-[#FF7A00]" />
        </div>
      ),
    },
  ];
  const [active, setActive] = useState("status");
  const activeTab = tabs.find((t) => t.key === active);
  return (
    <SectionWrap id="dashboard" className="bg-white">
      <Eyebrow n="07" label="Your Dashboard" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">Everything, in one simple screen.</h2>
      </Reveal>
      <Reveal delay={100} y={30}>
        <div className="rounded-[28px] bg-[#120D08] p-6 md:p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/50 text-sm">Good morning, Rahul 👋</p>
              <p className="font-mono text-xs text-[#FF7A00] mt-1">● ACTIVE PROTECTION</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold">₹1/day</p>
              <p className="text-xs text-white/40">Basic plan</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active === t.key ? "bg-[#FF7A00]/10 border-[#FF7A00]/40" : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                <t.icon className={`h-4 w-4 mb-3 ${active === t.key ? "text-[#FF7A00]" : "text-white/60"}`} />
                <span className={`text-xs font-medium ${active === t.key ? "text-white" : "text-white/70"}`}>{t.label}</span>
              </button>
            ))}
          </div>

          <div key={active} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 animate-fade-in">
            {activeTab.panel}
          </div>
        </div>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   BUILT FOR THE PEOPLE WHO MOVE INDIA
----------------------------------------------------------------*/
function MoveIndia() {
  const roles = [
    { icon: Bike, label: "Food Delivery" },
    { icon: Truck, label: "E-commerce Delivery" },
    { icon: Bike, label: "Bike Courier" },
    { icon: Car, label: "Auto Driver" },
    { icon: Car, label: "Cab Driver" },
    { icon: Briefcase, label: "Freelancer" },
    { icon: Users, label: "Students" },
  ];
  return (
    <SectionWrap id="for-workers" className="bg-[#120D08] text-white text-center">
      <Eyebrow n="08" label="For Workers & Students" />
      <Reveal>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Every delivery. Every ride.
          <br />Every shift. Every day.
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-white/50 max-w-xl mx-auto mb-16">We protect the people behind India's on-demand economy.</p>
      </Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {roles.map((r, i) => (
          <Reveal key={i} delay={i * 70}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 flex flex-col items-center gap-3 hover:bg-white/[0.09] hover:-translate-y-1.5 hover:border-[#FF7A00]/40 transition-all duration-300">
              <r.icon className="h-6 w-6 text-[#FF7A00]" strokeWidth={1.5} />
              <span className="text-xs text-white/60">{r.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   WHY US
----------------------------------------------------------------*/
function WhyUs() {
  const items = [
    { icon: Coins, title: "₹1/day", body: "Affordable protection." },
    { icon: Zap, title: "Digital First", body: "Buy and manage digitally." },
    { icon: Sparkles, title: "Simple", body: "No confusing insurance jargon." },
    { icon: Lock, title: "Transparent", body: "Clearly explained coverage and exclusions." },
    { icon: ShieldCheck, title: "Built for Gig Workers", body: "Designed around real gig-worker risks." },
    { icon: LifeBuoy, title: "Claims Assistance", body: "Help navigating the claims process." },
  ];
  return (
    <SectionWrap id="why-us" className="bg-white">
      <Eyebrow n="09" label="Why Kavach" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">Built differently, on purpose.</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 90}>
            <div className="rounded-3xl border border-[#E4DACB] p-6 h-full hover:border-[#FF7A00]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,28,44,0.08)] transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center mb-4">
                <it.icon className="h-5 w-5 text-[#FF7A00]" />
              </div>
              <h3 className="font-semibold text-[#120D08] mb-1.5">{it.title}</h3>
              <p className="text-sm text-[#4A3B2E]">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   TESTIMONIALS — auto-playing carousel
----------------------------------------------------------------*/
function Testimonials() {
  const items = [
    { name: "Amit", role: "Delivery Partner", quote: "I don't think about insurance every day. ₹1/day makes it simple enough to keep." },
    { name: "Priya", role: "Cab Driver", quote: "The app is easy to use, even when I'm in a hurry between rides." },
    { name: "Sanjay", role: "Freelancer", quote: "I finally have something set aside for the days I can't work." },
    { name: "Fatima", role: "Food Delivery", quote: "Filing felt straightforward — I could do it from my phone at home." },
    { name: "Neha", role: "Student", quote: "As a student who freelances on weekends, this gives me peace of mind without stretching my budget." },
  ];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <SectionWrap id="testimonials" className="bg-[#FFFFFF]">
      <Eyebrow n="10" label="Worker & Student Stories" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-2">Told by the people who ride, drive, deliver and study.</h2>
      </Reveal>
      <p className="text-xs text-[#4A3B2E] font-mono mb-14">Customer stories shown for demonstration.</p>

      <Reveal delay={100}>
        <div className="relative max-w-2xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateX(-${active * 100}%)` }}>
              {items.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-1">
                  <div className="rounded-3xl bg-white border border-[#E4DACB] p-10 text-center">
                    <p className="text-lg text-[#120D08] leading-relaxed mb-6">"{t.quote}"</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#FF7A00]/15 flex items-center justify-center font-mono text-xs font-bold text-[#FF7A00]">{t.name[0]}</div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#120D08]">{t.name}</p>
                        <p className="text-xs text-[#4A3B2E]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActive((a) => (a - 1 + items.length) % items.length)} className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-[#E4DACB] items-center justify-center hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setActive((a) => (a + 1) % items.length)} className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-[#E4DACB] items-center justify-center hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-7 bg-[#FF7A00]" : "w-2 bg-[#120D08]/15 hover:bg-[#120D08]/30"}`} />
            ))}
          </div>
        </div>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   PARTNERS
----------------------------------------------------------------*/
function Partners() {
  const targets = ["Gig platforms", "Delivery companies", "Fleet operators", "NGOs", "Worker communities", "Fintech companies", "Employers"];
  return (
    <SectionWrap id="partners" className="bg-[#120D08] text-white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow n="11" label="Partnerships" tone="amber" />
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Partner with us</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-white/50 mb-8 leading-relaxed max-w-md">Help your workers access affordable financial protection.</p>
          </Reveal>
          <Reveal delay={140}>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#FF7A00] text-[#120D08] font-semibold px-6 py-3.5 rounded-full hover:bg-[#FF9433] hover:scale-[1.03] active:scale-[0.97] transition-all">
              Become a Partner <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
        <div className="flex flex-wrap gap-3">
          {targets.map((t, i) => (
            <Reveal key={t} delay={i * 60}>
              <span className="inline-block rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:border-[#FF7A00]/40 hover:text-white hover:bg-white/[0.08] transition-all cursor-default">{t}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   FAQ — smooth accordion
----------------------------------------------------------------*/
function FAQ() {
  const faqs = [
    { q: "Is ₹1/day insurance?", a: "₹1/day is the illustrative premium/contribution for the selected protection product. Whether it is legally structured as insurance depends on the final product and licensed insurance partner." },
    { q: "Will I definitely receive ₹5,000?", a: "No. The maximum benefit is payable only when a qualifying covered event occurs and the claim meets the applicable policy terms." },
    { q: "Can I claim for any damage?", a: "Only damage or events specifically covered by your selected plan can be claimed." },
    { q: "Is this for students?", a: "Yes — the protection is designed for gig workers and eligible students. Coverage, eligibility and terms are shown during enrolment and may vary by product." },
    { q: "Can I cancel?", a: "Cancellation is available according to the actual policy terms of your selected plan — details are shown before you enrol." },
    { q: "How do I make a claim?", a: "Report the incident in the app, upload the required documents, and track the review through your dashboard." },
    { q: "Who provides the insurance?", a: "Coverage will be provided and underwritten by an appropriately licensed insurance partner." },
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <SectionWrap id="faq" className="bg-white">
      <Eyebrow n="12" label="FAQ" />
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#120D08] max-w-2xl mb-14">Questions, answered plainly.</h2>
      </Reveal>
      <Reveal delay={100}>
        <div className="max-w-2xl divide-y divide-[#E4DACB] border-t border-b border-[#E4DACB]">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i}>
                <button onClick={() => setOpenIdx(isOpen ? -1 : i)} className="w-full flex items-center justify-between py-5 text-left gap-4 group">
                  <span className={`font-medium transition-colors ${isOpen ? "text-[#FF7A00]" : "text-[#120D08] group-hover:text-[#FF7A00]"}`}>{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-[#4A3B2E] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#FF7A00]" : ""}`} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-[#4A3B2E] leading-relaxed pb-5">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   FINAL CTA
----------------------------------------------------------------*/
function FinalCTA() {
  return (
    <SectionWrap className="bg-[#120D08] text-white text-center py-28 overflow-hidden relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-[#FF7A00] opacity-[0.08] blur-[110px] pointer-events-none" />
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05] relative">
          ₹1 today.
          <br />
          <span className="text-[#FF7A00]">More protection tomorrow.</span>
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="text-white/50 max-w-lg mx-auto mb-10 relative">Because one unexpected event shouldn't wipe out a week's income.</p>
      </Reveal>
      <Reveal delay={180}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 relative">
          <a href="#plans" className="inline-flex items-center gap-2 bg-[#FF7A00] text-[#120D08] font-semibold px-8 py-4 rounded-full hover:bg-[#FF9433] hover:scale-[1.03] active:scale-[0.97] transition-all">
            Get Protected <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#how-it-works" className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 rounded-full hover:bg-white/5 hover:border-white/40 transition-all">
            See How It Works
          </a>
        </div>
      </Reveal>
      <p className="text-xs font-mono text-white/30 relative">Designed for India's gig workers.</p>
    </SectionWrap>
  );
}

/* ---------------------------------------------------------------
   FOOTER
----------------------------------------------------------------*/
function Footer() {
  const cols = [
    { title: "Company", links: ["How It Works", "Protection", "For Workers & Students", "Partners"] },
    { title: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Insurance/Product Disclosure", "Grievance Redressal"] },
    { title: "Support", links: ["Claims Information", "FAQ", "Contact"] },
  ];
  return (
    <footer id="contact" className="bg-[#0C0906] text-white/60 px-6 md:px-12 lg:px-20 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-[#FF7A00] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-[#120D08]" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white">Kavach</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed">Affordable financial protection for India's gig workers — delivery partners, drivers and freelancers.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-mono uppercase tracking-wide text-white/30 mb-4">{c.title}</p>
              <ul className="space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-8">
          <p className="text-xs leading-relaxed text-white/40">
            This website presents a concept/demo for an affordable protection platform. Coverage, benefits, premiums, eligibility, exclusions and claims are subject to the final approved product/policy terms and applicable regulations. Kavach does not currently hold, and does not claim, IRDAI approval or authorization; insurance products, where offered, will be provided and underwritten by an appropriately licensed insurance partner.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-white/30">
          <span>© 2026 Kavach. Concept demonstration.</span>
          <span className="font-mono">Made for the people who move India.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------
   ROOT
----------------------------------------------------------------*/
export default function KavachLanding() {
  return (
    <div className="font-sans antialiased" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        h1, h2, h3 { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        html { scroll-behavior: smooth; }

        @keyframes floatCoin {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(-160px) rotate(24deg); opacity: 0; }
        }
        .coin-float { animation: floatCoin 6s ease-in-out infinite; }

        @keyframes coinBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .coin-bob { display: inline-block; animation: coinBob 3.4s ease-in-out infinite; }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 16px 40px rgba(11,28,44,0.10), 0 0 0 0 rgba(255,122,0,0); }
          50% { box-shadow: 0 16px 40px rgba(11,28,44,0.10), 0 0 36px 0 rgba(255,122,0,0.25); }
        }
        .plan-glow { animation: pulseGlow 3.2s ease-in-out infinite; }

        @keyframes arrowNudge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        .animate-arrow-nudge { animation: arrowNudge 1.6s ease-in-out infinite; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.35s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
        }
      `}</style>
      <RouteRail />
      <Navbar />
      <Hero />
      <TrustStrip />
      <Problem />
      <Solution />
      <Plans />
      <Calculator />
      <OneRupee />
      <ClaimableEvents />
      <ClaimProcess />
      <DashboardPreview />
      <MoveIndia />
      <WhyUs />
      <Testimonials />
      <Partners />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

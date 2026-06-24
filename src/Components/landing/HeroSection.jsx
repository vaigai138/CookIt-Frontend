import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Smartphone, Check, Zap } from "lucide-react";
import AuroraBackground from "../ui/AuroraBackground";
import Highlight from "../ui/Highlight";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.07 * i, ease: [0.21, 0.47, 0.32, 0.98] } }),
};
const cardIn = {
  hidden: { opacity: 0, y: 36, scale: 0.95 },
  show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: 0.5 + i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] } }),
};

const CARD = "bg-white border border-gray-200/90 rounded-2xl shadow-premium-lg";

/* ── Crisp mock-UI cards (pure CSS) ── */
const DashboardCard = () => (
  <div className={`${CARD} p-4 w-[15rem]`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Monthly revenue</p>
        <p className="text-xl font-bold text-gray-900">₹4.8L</p>
      </div>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full">
        <TrendingUp size={11} /> +24%
      </span>
    </div>
    <div className="mt-4 flex items-end gap-1.5 h-16">
      {[42, 64, 52, 80, 60, 96, 74].map((h, i) => (
        <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-blue-600 to-indigo-400" style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }} />
      ))}
    </div>
    <p className="mt-3 text-[10px] text-gray-400">Custom dashboard · live data</p>
  </div>
);

const ChatCard = () => (
  <div className={`${CARD} p-4 w-[17rem]`}>
    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">C</div>
      <div>
        <p className="text-xs font-semibold text-gray-900 leading-tight">Coco · AI Assistant</p>
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> online</span>
      </div>
    </div>
    <div className="mt-3 space-y-2">
      <div className="max-w-[82%] bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] text-gray-700">Hey! What can we build for you?</div>
      <div className="ml-auto max-w-[82%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[11px]">An inventory system for my shop 📦</div>
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-2xl rounded-tl-sm w-fit">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
    </div>
  </div>
);

const AutomationCard = () => (
  <div className={`${CARD} p-4 w-[15rem]`}>
    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Zap size={15} /></span>
      <div>
        <p className="text-xs font-semibold text-gray-900 leading-tight">Workflow</p>
        <p className="text-[10px] text-emerald-500">Automated · running</p>
      </div>
    </div>
    <div className="mt-3 space-y-2.5">
      {["New lead captured", "Welcome email sent", "Added to CRM"].map((t) => (
        <div key={t} className="flex items-center gap-2 text-[11px] text-gray-600">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-600"><Check size={10} /></span>
          {t}
        </div>
      ))}
      <div className="flex items-center gap-2 text-[11px] text-gray-300">
        <span className="w-4 h-4 rounded-full border-2 border-gray-200" />
        Follow-up scheduled
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <AuroraBackground />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pt-20 text-center">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          <span className="group inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 glass rounded-full shadow-premium">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white"><Sparkles size={11} /></span>
            Technology partner for growing businesses
          </span>
        </motion.div>

        <motion.h1
          variants={fade} initial="hidden" animate="show" custom={1}
          className="mt-7 mx-auto max-w-4xl text-[2.5rem] leading-[1.06] font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl font-pj text-balance"
        >
          We build the websites, software &amp; systems that{" "}
          <Highlight>grow your business</Highlight>.
        </motion.h1>

        <motion.p
          variants={fade} initial="hidden" animate="show" custom={2}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl text-pretty"
        >
          From high-converting websites to custom software, mobile apps, and AI-powered automation —
          built around how your business actually works.
        </motion.p>

        <motion.div variants={fade} initial="hidden" animate="show" custom={3} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary group inline-flex items-center justify-center w-full gap-2 px-7 py-3.5 text-base font-semibold rounded-xl sm:w-auto">
            Start Your Project
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/build" className="btn-ghost inline-flex items-center justify-center w-full gap-2 px-7 py-3.5 text-base font-semibold rounded-xl sm:w-auto">
            <Sparkles size={17} className="text-blue-600" /> Build with AI
          </Link>
        </motion.div>

        <motion.p variants={fade} initial="hidden" animate="show" custom={4} className="mt-5 text-sm text-gray-500">
          No generic templates — every solution is custom-built for you.
        </motion.p>

        {/* Aligned floating card row */}
        <div className="relative mt-16 hidden md:flex items-end justify-center gap-5 lg:gap-7">
          <motion.div variants={cardIn} initial="hidden" animate="show" custom={0} className="-rotate-[4deg]">
            <div className="animate-float-slow"><DashboardCard /></div>
          </motion.div>
          <motion.div variants={cardIn} initial="hidden" animate="show" custom={2} className="-translate-y-10 z-10">
            <div className="animate-float"><ChatCard /></div>
          </motion.div>
          <motion.div variants={cardIn} initial="hidden" animate="show" custom={1} className="rotate-[4deg]">
            <div className="animate-float-slow" style={{ animationDelay: "-3s" }}><AutomationCard /></div>
          </motion.div>
        </div>

        {/* Mobile: single clean card */}
        <div className="mt-12 flex justify-center md:hidden">
          <ChatCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

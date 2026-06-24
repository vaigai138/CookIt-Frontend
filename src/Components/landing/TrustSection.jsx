import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { TRUST_CLIENTS, TRUST_STATS } from "../../data/landing";

const TrustSection = () => {
  return (
    <section className="py-16 bg-white border-y border-gray-100 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="text-center text-sm font-medium tracking-wide text-gray-500 uppercase"
        >
          Real businesses. Real results.
        </motion.p>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 rounded-3xl border border-gray-200 overflow-hidden bg-gray-50/60">
          {TRUST_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
              className="px-6 py-7 text-center border-gray-200 [&:not(:nth-child(2n))]:border-r lg:[&:not(:last-child)]:border-r [&:nth-child(-n+2)]:border-b lg:[&]:border-b-0"
            >
              <div className="text-2xl font-bold text-gray-900 sm:text-3xl font-pj">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Custom software signal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} viewport={{ once: true }}
          className="mt-6 flex flex-col items-center justify-center gap-3 px-6 py-5 text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-100 rounded-2xl sm:flex-row sm:text-left"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shrink-0">
            <Sparkles size={18} />
          </span>
          <p className="text-base text-gray-700">
            We don't just build websites — we also build{" "}
            <strong className="text-gray-900">customized software, mobile apps, and automation</strong>{" "}
            tailored to how your business runs.
          </p>
        </motion.div>

        {/* Client links (text, minimal) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_CLIENTS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {c.name}
              <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Code2, Smartphone, Workflow } from "lucide-react";

const ITEMS = [
  { icon: Globe, label: "Websites" },
  { icon: Code2, label: "Software Solutions" },
  { icon: Smartphone, label: "Mobile Applications" },
  { icon: Workflow, label: "Automation Systems" },
];

const BeyondWebsitesSection = () => {
  return (
    <section className="py-20 bg-gray-50 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative grain overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-16 sm:px-12 sm:py-24">
          {/* Animated aurora */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute -top-32 left-10 w-[30rem] h-[30rem] rounded-full blur-[120px] animate-aurora"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,0.6), transparent 65%)" }} />
            <div className="absolute -bottom-40 right-0 w-[34rem] h-[34rem] rounded-full blur-[130px] animate-aurora"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 65%)", animationDelay: "-8s" }} />
          </div>

          <div className="relative text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold tracking-wide text-blue-300 uppercase bg-white/5 border border-white/10 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" /> The bigger picture
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} viewport={{ once: true }}
              className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-pj"
            >
              Beyond <span className="gradient-text">Websites</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
              className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl"
            >
              Today we build websites, software solutions, mobile applications, and automation
              systems that help businesses operate more efficiently and scale faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              {ITEMS.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 glass-dark rounded-full">
                  <Icon size={16} className="text-blue-400" />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
              className="mt-10"
            >
              <Link
                to="/services/custom-software"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-gray-900 bg-white rounded-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore custom software
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeyondWebsitesSection;

import React from "react";
import { motion } from "framer-motion";
import { PROCESS } from "../../data/landing";
import { ICONS } from "./icons";
import SectionHeading from "./SectionHeading";

const HowWeWorkSection = () => {
  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How we work"
          title="From idea to impact, step by step"
          subtitle="A clear, collaborative process — so you always know what's happening and why."
        />

        <div className="relative mt-16">
          {/* Connecting gradient line on desktop */}
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto w-16 h-16">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-md opacity-30" />
                    <div className="relative flex items-center justify-center w-16 h-16 text-white rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-glow">
                      {Icon && <Icon size={26} />}
                    </div>
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 text-xs font-bold text-blue-700 bg-white border border-blue-100 rounded-full shadow-sm">
                      {p.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-gray-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;

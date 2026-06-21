import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { PILLARS, SECONDARY_SERVICES } from "../../data/landing";
import { ICONS } from "./icons";
import SectionHeading from "./SectionHeading";

const ACCENT = {
  "business-websites": "from-blue-500 to-indigo-600",
  "custom-software": "from-indigo-500 to-violet-600",
  "mobile-applications": "from-sky-500 to-blue-600",
  "ai-automation": "from-cyan-500 to-blue-600",
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we do"
          title="Four pillars, one partner"
          subtitle="Everything you need to take your business digital — designed, built, and supported by one team."
        />

        {/* Primary pillars — clean uniform grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((pillar, i) => {
            const Icon = ICONS[pillar.icon];
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                viewport={{ once: true }}
              >
                <Link
                  to={pillar.href}
                  className="group flex flex-col h-full p-7 bg-white border border-gray-200 rounded-3xl transition-colors duration-200 hover:border-blue-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 text-white rounded-2xl bg-gradient-to-br ${ACCENT[pillar.id]} shadow-sm`}>
                      {Icon && <Icon size={24} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pillar.title}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{pillar.tagline}</p>

                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={15} className="text-blue-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-blue-600">
                    Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary services band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="mt-6 p-6 sm:p-8 bg-white border border-gray-200 rounded-3xl"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-gray-900">Also offered</h3>
            <p className="text-sm text-gray-500">Supporting services to help what we build succeed.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {SECONDARY_SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.title} className="flex gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    {Icon && <Icon size={20} />}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                    <p className="mt-0.5 text-sm text-gray-500">{s.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;

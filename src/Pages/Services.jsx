import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";
import CTABand from "../Components/common/CTABand";
import { SERVICES, SERVICE_ORDER } from "../data/services";
import { SECONDARY_SERVICES } from "../data/landing";
import { ICONS } from "../Components/landing/icons";

const ACCENT = {
  "business-websites": "from-blue-500 to-indigo-600",
  "custom-software": "from-indigo-500 to-violet-600",
  "mobile-applications": "from-sky-500 to-blue-600",
  "ai-automation": "from-cyan-500 to-blue-600",
};

const Services = () => {
  return (
    <>
      <PageMeta
        title="Services — Websites, Custom Software, Mobile Apps & AI | CookIT"
        description="CookIT's four service pillars: business websites, custom software, mobile applications, and AI & automation — plus digital marketing — all built around your business."
      />

      <PageHero
        eyebrow="Our Services"
        title="Four pillars. One technology partner."
        subtitle="From your first website to the software that runs your operations — we build it all, tailored to how your business works."
      />

      {/* Alternating feature rows */}
      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
          {SERVICE_ORDER.map((slug, i) => {
            const s = SERVICES[slug];
            const Icon = ICONS[s.icon];
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                viewport={{ once: true, margin: "-80px" }}
                className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-center"
              >
                {/* Visual — gradient panel with floating offering chips */}
                <div className={reversed ? "lg:order-2" : ""}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${ACCENT[slug]} p-8 sm:p-10 aspect-[16/12] flex flex-col justify-between`}>
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 text-white backdrop-blur">
                      {Icon && <Icon size={28} />}
                    </div>
                    <div className="relative flex flex-wrap gap-2">
                      {s.offerings.map((o) => (
                        <span key={o.name} className="px-3 py-1.5 text-xs font-medium text-white bg-white/15 border border-white/20 rounded-full backdrop-blur">
                          {o.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detail */}
                <div className={reversed ? "lg:order-1" : ""}>
                  <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Pillar {String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl font-pj text-balance">{s.title}</h2>
                  <p className="mt-4 text-gray-600 text-pretty">{s.intro}</p>
                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-blue-600 shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/services/${slug}`} className="inline-flex items-center gap-1.5 mt-7 text-sm font-semibold text-blue-600 group">
                    Explore {s.title} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Secondary services */}
      <section className="py-16 bg-gray-50 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl font-pj">Supporting services</h2>
            <p className="mt-3 text-gray-600">To help everything we build actually reach customers.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {SECONDARY_SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.title} className="p-6 bg-white border border-gray-200 rounded-2xl transition-colors hover:border-blue-300">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                    {Icon && <Icon size={22} />}
                  </span>
                  <h3 className="mt-4 font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABand title="Not sure which you need?" subtitle="Tell us about your business — we'll recommend the right solution, no jargon." />
    </>
  );
};

export default Services;

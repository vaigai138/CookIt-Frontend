import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import CTABand from "../Components/common/CTABand";
import AuroraBackground from "../Components/ui/AuroraBackground";
import { SERVICES, SERVICE_ORDER } from "../data/services";
import { ICONS } from "../Components/landing/icons";

const ACCENT = {
  "business-websites": "from-blue-500 to-indigo-600",
  "custom-software": "from-indigo-500 to-violet-600",
  "mobile-applications": "from-sky-500 to-blue-600",
  "ai-automation": "from-cyan-500 to-blue-600",
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = SERVICES[slug];
  if (!service) return <Navigate to="/services" replace />;

  const Icon = ICONS[service.icon];
  const accent = ACCENT[slug];
  const idx = SERVICE_ORDER.indexOf(slug);
  const next = SERVICE_ORDER[(idx + 1) % SERVICE_ORDER.length];
  const nextService = SERVICES[next];

  return (
    <>
      <PageMeta title={`${service.title} — CookIT`} description={service.tagline} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-20">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft size={15} /> All services
          </Link>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className={`flex items-center justify-center w-20 h-20 rounded-3xl text-white bg-gradient-to-br ${accent} shadow-glow shrink-0`}>
              {Icon && <Icon size={38} />}
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-pj text-balance">{service.title}</h1>
              <p className="mt-3 text-lg text-gray-600 sm:text-xl text-pretty">{service.tagline}</p>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-3xl text-lg leading-relaxed text-gray-600 text-pretty"
          >
            {service.intro}
          </motion.p>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl font-pj">What we build</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {service.offerings.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }} viewport={{ once: true }}
                className="group p-6 bg-gray-50 border border-gray-200 rounded-2xl transition-colors hover:border-blue-300"
              >
                <div className={`flex items-center justify-center w-9 h-9 mb-4 rounded-lg text-white bg-gradient-to-br ${accent}`}>
                  <Sparkles size={16} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{o.name}</h3>
                <p className="mt-2 text-gray-600">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + outcome */}
      <section className="py-12 bg-gray-50 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="p-8 bg-white border border-gray-200 rounded-3xl">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl font-pj">Why it matters</h2>
            <ul className="mt-6 space-y-3.5">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-gray-700">
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-white bg-gradient-to-br ${accent} shrink-0 mt-0.5`}><Check size={12} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className={`relative grain overflow-hidden rounded-3xl bg-gray-950 p-8 flex flex-col justify-center`}>
            <div className={`pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full blur-[100px] animate-aurora`} style={{ background: "radial-gradient(circle, rgba(37,99,235,0.5), transparent 65%)" }} />
            <h3 className="relative text-sm font-semibold tracking-wide text-blue-300 uppercase">The outcome</h3>
            <p className="relative mt-3 text-xl font-medium leading-relaxed text-white text-balance">{service.outcome}</p>
          </div>
        </div>
      </section>

      {/* Next service */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/services/${next}`}
            className="group flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl transition-colors hover:border-blue-300"
          >
            <div>
              <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Next service</span>
              <h3 className="mt-1 text-lg font-bold text-gray-900">{nextService.title}</h3>
            </div>
            <ArrowRight size={22} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </section>

      <CTABand title={`Ready to start with ${service.title}?`} />
    </>
  );
};

export default ServiceDetail;

import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Compass, Users, Lightbulb, ShieldCheck, TrendingUp } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import CTABand from "../Components/common/CTABand";
import AuroraBackground from "../Components/ui/AuroraBackground";
import Highlight from "../Components/ui/Highlight";

const JOURNEY = [
  { year: "2025", title: "Where we started", text: "CookIT began with one mission: help businesses build a strong digital presence through professional websites and digital services." },
  { year: "Today", title: "How we've grown", text: "Real client work showed us businesses need more than a website — they need technology that solves operational problems. So we expanded into custom software, mobile apps, and automation." },
  { year: "Tomorrow", title: "Where we're going", text: "We're becoming a trusted technology partner — and as we grow across industries, our custom solutions may evolve into scalable products for a broader market." },
];

const VALUES = [
  { icon: Users, title: "Client-First", text: "We start with your real challenges, not a generic product." },
  { icon: Lightbulb, title: "Practical Innovation", text: "We use technology — including AI — where it genuinely creates value." },
  { icon: ShieldCheck, title: "Built to Last", text: "Clean, maintainable, scalable systems that grow with you." },
  { icon: TrendingUp, title: "Measurable Value", text: "Success is the real impact on your business: efficiency and growth." },
];

const About = () => {
  return (
    <>
      <PageMeta
        title="About CookIT — Your Technology Partner"
        description="CookIT started in 2025 helping businesses build their digital presence, and has grown into a technology solutions company delivering websites, custom software, mobile apps, and AI automation."
      />

      {/* Editorial hero */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" /> Our story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-pj text-balance leading-[1.08]"
          >
            From a website studio to a full{" "}
            <Highlight>technology partner</Highlight>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl text-pretty"
          >
            We help businesses digitize, automate, and scale — building custom solutions around each
            client's real-world needs.
          </motion.p>
        </div>
      </section>

      {/* Story — large editorial statement with drop cap */}
      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-xl leading-relaxed text-gray-700 sm:text-2xl sm:leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 first-letter:leading-[0.8] first-letter:font-pj"
          >
            CookIT was founded in 2025 to help businesses establish a strong digital presence. But working
            with real clients across industries made one thing clear — businesses need much more than a
            website. They need technology that solves operational challenges, improves efficiency, and
            supports growth. So we evolved into a technology solutions company that builds it all.
          </motion.p>
        </div>
      </section>

      {/* Journey — connected timeline */}
      <section className="py-16 bg-gray-50 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200" />
            {JOURNEY.map((j, i) => (
              <motion.div
                key={j.year}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}
                className="relative text-center md:text-left"
              >
                <div className="relative z-10 inline-flex items-center justify-center w-24 h-12 rounded-full bg-white border border-gray-200 shadow-sm font-bold text-blue-600">
                  {j.year}
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{j.title}</h3>
                <p className="mt-2 text-gray-600 text-pretty">{j.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Approach — dark aurora panel */}
      <section className="py-16 bg-white sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grain overflow-hidden rounded-[2rem] bg-gray-950 p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 left-10 w-96 h-96 rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.45), transparent 65%)" }} />
              <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)", animationDelay: "-8s" }} />
            </div>
            <div className="relative grid gap-6 md:grid-cols-3">
              {[
                { icon: Target, title: "Our Mission", text: "Help businesses digitize, automate, and scale with solutions built around their unique needs." },
                { icon: Eye, title: "Our Vision", text: "Become the trusted technology partner businesses rely on to grow in the digital world." },
                { icon: Compass, title: "Our Approach", text: "Understand the real problem first, then build a tailored solution that delivers measurable value." },
              ].map((item) => (
                <div key={item.title} className="glass-dark rounded-2xl p-6">
                  <div className="flex items-center justify-center w-12 h-12 mb-5 text-white rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-gray-300 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-pj text-balance">What we value</h2>
            <p className="mt-4 text-lg text-gray-600">The principles behind every project we take on.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }} viewport={{ once: true }}
                className="p-6 bg-white border border-gray-200 rounded-2xl transition-colors hover:border-blue-300"
              >
                <div className="flex items-center justify-center w-11 h-11 mb-4 text-blue-600 bg-blue-50 rounded-xl">
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Let's build something for your business"
        subtitle="Whether it's a website, custom software, an app, or automation — we'll help you figure out the right move."
      />
    </>
  );
};

export default About;

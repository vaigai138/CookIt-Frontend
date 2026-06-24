import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "../../data/landing";
import SectionHeading from "./SectionHeading";

const Stars = () => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, s) => (
      <Star key={s} size={15} className="text-amber-400 fill-amber-400" />
    ))}
  </div>
);

const Avatar = ({ name }) => (
  <div className="flex items-center justify-center w-11 h-11 text-base font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0">
    {name.charAt(0)}
  </div>
);

const TestimonialsSection = () => {
  if (!TESTIMONIALS.length) return null;
  const featured = TESTIMONIALS.find((t) => t.featured) || TESTIMONIALS[0];
  const others = TESTIMONIALS.filter((t) => t !== featured);

  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by the businesses we build for"
          subtitle="Real words from real clients we've partnered with."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Featured — big quote */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
            className="lg:col-span-3 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gray-950 text-white relative overflow-hidden grain"
          >
            <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full blur-[100px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.5), transparent 65%)" }} />
            <div className="relative">
              <Stars />
              <blockquote className="mt-5 text-2xl font-medium leading-snug sm:text-[1.65rem] text-balance">
                "{featured.quote}"
              </blockquote>
            </div>
            <figcaption className="relative mt-8 flex items-center gap-3">
              <Avatar name={featured.name} />
              <div>
                <div className="font-bold">{featured.name}</div>
                <div className="text-sm text-gray-400">{featured.role}</div>
              </div>
            </figcaption>
          </motion.figure>

          {/* Supporting — stacked */}
          <div className="lg:col-span-2 grid gap-6">
            {others.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }} viewport={{ once: true }}
                className="flex flex-col justify-between p-6 bg-gray-50 border border-gray-200 rounded-3xl"
              >
                <div>
                  <Stars />
                  <blockquote className="mt-3 text-gray-700 leading-relaxed">"{t.quote}"</blockquote>
                </div>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar name={t.name} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

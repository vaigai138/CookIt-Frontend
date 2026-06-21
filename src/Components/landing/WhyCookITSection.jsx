import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WHY_COOKIT } from "../../data/landing";
import { ICONS } from "./icons";

const WhyCookITSection = () => {
  return (
    <section className="py-20 bg-gray-50 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-28 self-start"
          >
            <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" /> Why CookIT
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] font-pj text-balance">
              A partner, not just a vendor
            </h2>
            <p className="mt-5 text-lg text-gray-600 text-pretty">
              We measure success by the value we create for your business — not by the lines of code we ship.
            </p>
            <Link to="/about" className="inline-flex items-center gap-1.5 mt-7 text-sm font-semibold text-blue-600">
              More about us <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right — value rows */}
          <div className="lg:col-span-7 divide-y divide-gray-200 border-y border-gray-200">
            {WHY_COOKIT.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }} viewport={{ once: true }}
                  className="group flex items-start gap-5 py-7"
                >
                  <span className="flex items-center justify-center w-11 h-11 text-blue-600 bg-white border border-gray-200 rounded-xl shrink-0 transition-colors group-hover:border-blue-300">
                    {Icon && <Icon size={22} />}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-1.5 text-gray-600">{item.text}</p>
                  </div>
                  <span className="ml-auto text-2xl font-bold text-gray-200 tabular-nums">0{i + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCookITSection;

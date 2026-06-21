import React from "react";
import { motion } from "framer-motion";
import { INDUSTRIES } from "../../data/landing";
import { ICONS } from "./icons";
import SectionHeading from "./SectionHeading";

const IndustriesSection = () => {
  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries we serve"
          title="Solutions for every kind of business"
          subtitle="We've worked across industries — and we tailor every build to how your sector actually operates."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INDUSTRIES.map((industry, i) => {
            const Icon = ICONS[industry.icon];
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="group relative flex flex-col items-center justify-center gap-3 p-6 text-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-transparent hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-indigo-600" />
                <div className="relative flex items-center justify-center w-12 h-12 text-blue-600 bg-white border border-gray-200 rounded-xl group-hover:text-blue-600 transition-colors">
                  {Icon && <Icon size={22} />}
                </div>
                <span className="relative text-sm font-semibold text-gray-800 group-hover:text-white transition-colors">{industry.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;

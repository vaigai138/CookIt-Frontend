import React from "react";
import { motion } from "framer-motion";
import AuroraBackground from "../ui/AuroraBackground";

// Consistent top hero for inner pages, matching the landing hero's aurora language.
const PageHero = ({ eyebrow, title, subtitle, children }) => {
  return (
    <section className="relative overflow-hidden">
      <AuroraBackground />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-pj"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;

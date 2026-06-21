import React from "react";
import { motion } from "framer-motion";

// Shared section heading: gradient-dot eyebrow pill + bold title + subtitle.
const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  const isCenter = align !== "left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`flex flex-col max-w-2xl ${isCenter ? "items-center text-center mx-auto" : "items-start text-left"}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] font-pj">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
    </motion.div>
  );
};

export default SectionHeading;

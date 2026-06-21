import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Sparkles, ArrowRight } from "lucide-react";
import AuroraBackground from "../ui/AuroraBackground";

const FinalCTASection = () => {
  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden sm:py-32">
      <AuroraBackground grid={false} />

      <div className="relative max-w-3xl mx-auto px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 text-sm font-medium text-gray-700 glass rounded-full shadow-premium"
        >
          <Sparkles size={15} className="text-blue-600" /> Let's build together
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-pj"
        >
          Ready to <span className="gradient-text">digitize</span> your business?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          className="mt-6 text-lg text-gray-600 sm:text-xl"
        >
          Let's discuss how technology can help your business work smarter, serve customers better,
          and grow faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="btn-primary group inline-flex items-center justify-center w-full gap-2 px-8 py-4 text-base font-semibold rounded-xl sm:w-auto"
          >
            <Phone size={18} /> Schedule a Call
          </Link>
          <Link
            to="/build"
            className="btn-ghost group inline-flex items-center justify-center w-full gap-2 px-8 py-4 text-base font-semibold rounded-xl sm:w-auto"
          >
            <Sparkles size={17} className="text-blue-600" /> Get an AI Blueprint
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

// Reusable closing call-to-action band for inner pages.
const CTABand = ({
  title = "Ready to get started?",
  subtitle = "Tell us about your business and we'll map out a solution that fits.",
  primaryLabel = "Schedule a Call",
  primaryTo = "/contact",
  secondaryLabel = "Build with AI",
  secondaryTo = "/build",
}) => {
  return (
    <section className="py-20 bg-gray-50 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative grain overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-16 text-center sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute -top-24 -left-10 w-80 h-80 rounded-full blur-[110px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.55), transparent 65%)" }} />
            <div className="absolute -bottom-28 right-0 w-96 h-96 rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.45), transparent 65%)", animationDelay: "-8s" }} />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl font-pj">{title}</h2>
            <p className="mt-4 max-w-xl mx-auto text-gray-300">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={primaryTo}
                className="inline-flex items-center justify-center w-full gap-2 px-7 py-3.5 text-base font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition duration-200 sm:w-auto"
              >
                <Phone size={18} />
                {primaryLabel}
              </Link>
              <Link
                to={secondaryTo}
                className="inline-flex items-center justify-center w-full gap-2 px-7 py-3.5 text-base font-semibold text-white border border-white/20 rounded-lg hover:bg-white/10 transition duration-200 sm:w-auto"
              >
                {secondaryLabel}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABand;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Hammer } from "lucide-react";
import PageMeta from "../Components/PageMeta";

// Temporary stand-in for pages whose real content lands in a later build phase.
// Keeps every route reachable and SEO-tagged while the design is in progress.
const Placeholder = ({ title, subtitle, phase }) => {
  return (
    <>
      <PageMeta title={`${title} — CookIT`} description={subtitle} />
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
            <Hammer size={15} />
            {phase ? `Coming in ${phase}` : "Under construction"}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg text-gray-600">{subtitle}</p>
          )}
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white rounded-md bg-gradient-to-b from-blue-500 to-blue-600 hover:shadow-xl transition duration-200"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Placeholder;

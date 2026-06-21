import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../data/landing";
import SectionHeading from "./SectionHeading";

const FaqSection = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know before working with us."
        />

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen ? "border-transparent gradient-border bg-white shadow-premium" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex items-center justify-between w-full gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-gray-900 sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 ${isOpen ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

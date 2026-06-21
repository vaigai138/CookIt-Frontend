import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import projectsData from "../../utils/ProjectData";
import SectionHeading from "./SectionHeading";

const FEATURED = projectsData.slice(0, 3);

// A tidy browser-chrome frame around a live screenshot.
const BrowserFrame = ({ project }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
      <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
      <span className="ml-2 flex-1 truncate text-[10px] text-gray-400">{project.link.replace(/^https?:\/\//, "")}</span>
    </div>
    <div className="relative aspect-[16/11] bg-gray-100 overflow-hidden">
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  </div>
);

const FeaturedProjectsSection = () => {
  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Featured work"
            title="Websites we're proud of"
            subtitle="Real, live sites we've built for businesses across industries."
          />
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 shrink-0">
            View all work <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group block"
            >
              <BrowserFrame project={project} />
              <div className="flex items-start justify-between mt-4">
                <div>
                  <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">{project.category}</span>
                  <h3 className="mt-0.5 text-lg font-bold text-gray-900">{project.title}</h3>
                </div>
                <ArrowUpRight size={20} className="mt-1 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import projectsData from "../../utils/ProjectData";

// Alternating large showcase rows — each a live screenshot in a browser frame.
const ProjectRow = ({ project, index }) => {
  const reversed = index % 2 === 1;
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true, margin: "-80px" }}
      className="group grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-center"
    >
      {/* Screenshot */}
      <div className={`${reversed ? "lg:order-2" : ""}`}>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-premium">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 flex-1 truncate text-[11px] text-gray-400">{project.link.replace(/^https?:\/\//, "")}</span>
          </div>
          <div className="aspect-[16/11] bg-gray-100 overflow-hidden">
            <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className={`${reversed ? "lg:order-1" : ""}`}>
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide bg-blue-50 rounded-full">{project.category}</span>
        <h3 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl font-pj">{project.title}</h3>
        <p className="mt-3 text-gray-600 text-pretty">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags?.map((t) => (
            <span key={t} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">{t}</span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-blue-600">
          Visit live site <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.a>
  );
};

const ProjectsSection = () => {
  return (
    <section className="py-20 bg-white sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" /> Selected work
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl font-pj text-balance">Live websites we've built</h2>
          <p className="mt-4 text-lg text-gray-600 text-pretty">Real, in-production sites for businesses across real estate, media, and hospitality.</p>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {projectsData.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

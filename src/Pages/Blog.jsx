import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, FileText } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

const Blog = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch("/content/blog-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts((data || []).filter((p) => p.status === "published").sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))))
      .catch(() => setPosts([]));
  }, []);

  const featured = posts?.[0];
  const rest = posts?.slice(1) || [];

  return (
    <>
      <PageMeta
        title="Blog — Insights on Technology & Growth | CookIT"
        description="Practical insights on websites, custom software, mobile apps, automation, and growing your business digitally — from the CookIT team."
      />
      <PageHero
        eyebrow="CookIT Blog"
        title="Insights to grow your business"
        subtitle="Practical thinking on technology, automation, and digitizing the way you work."
      />

      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts === null ? (
            <div className="py-20 text-center"><Loader2 size={28} className="mx-auto text-blue-600 animate-spin" /></div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center mb-16">
                  <div className="overflow-hidden aspect-[16/10] bg-gray-100 rounded-2xl">
                    {featured.coverImage ? (
                      <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100" />
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full uppercase tracking-wide">Latest</span>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl group-hover:text-blue-600 transition-colors font-pj">{featured.title}</h2>
                    <p className="mt-3 text-gray-600 line-clamp-3">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                      <span>{featured.author}</span><span>·</span><span>{formatDate(featured.publishedAt)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">Read article <ArrowRight size={16} /></span>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 border-t border-gray-100 pt-12">
                  {rest.map((post, i) => (
                    <motion.article key={post.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }}>
                      <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full">
                        <div className="overflow-hidden aspect-[16/10] bg-gray-100 rounded-2xl mb-5">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{formatDate(post.publishedAt)}</span>
                            {post.tags?.[0] && <><span>·</span><span className="text-blue-600 font-medium">{post.tags[0]}</span></>}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">{post.excerpt}</p>
                          <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-600">Read more <ArrowRight size={15} /></span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;

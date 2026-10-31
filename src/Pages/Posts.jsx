import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, ArrowRight } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";
import { fetchPublishedPosts, slugifyId, instaThumb } from "../utils/postsApi";

const PostThumb = ({ post }) => {
  const [failed, setFailed] = useState(false);
  const cover = instaThumb(post.instaLink);
  if (cover && !failed) {
    return <img src={cover} alt={post.title || post.id} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
  }
  return <span className="text-gray-200 text-4xl font-bold">{post.id}</span>;
};

export default function Posts() {
  const [posts, setPosts] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => { fetchPublishedPosts().then(setPosts); }, []);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const s = q.trim().toLowerCase();
    if (!s) return posts;
    return posts.filter((p) => [p.id, p.title, p.description].some((f) => (f || "").toLowerCase().includes(s)));
  }, [posts, q]);

  return (
    <>
      <PageMeta
        title="Resources & Downloads | CookIT"
        description="Free assets, guides and downloads shared by CookIT — find a post by its video ID or title."
      />
      <PageHero
        eyebrow="CookIT Posts"
        title="Resources & downloads"
        subtitle="Got here from a comment? Search your video ID or title below to find your asset."
      />

      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10 relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by video ID, title, or keyword…"
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 pr-11 text-gray-900 outline-none focus:border-blue-500 transition-colors"
            />
            <Search size={18} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {posts === null ? (
            <div className="py-20 text-center"><Loader2 size={28} className="mx-auto text-blue-600 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-20">{posts.length === 0 ? "No posts yet. Check back soon." : `No posts match “${q}”.`}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link key={p.id} to={`/posts/${slugifyId(p.id)}`} className="group block rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="aspect-[16/10] bg-gray-100 border-b border-gray-100 overflow-hidden flex items-center justify-center">
                    <PostThumb post={p} />
                  </div>
                  <div className="p-6">
                    <span className="text-[0.65rem] font-mono uppercase tracking-widest text-blue-600/70">{p.id}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors">{p.title || "Untitled"}</h3>
                    {p.description && <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>}
                    <span className="text-sm text-blue-600 inline-flex items-center gap-1 mt-4">Open <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

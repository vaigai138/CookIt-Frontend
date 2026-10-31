import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import { fetchPost, instaEmbed } from "../utils/postsApi";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let cancelled = false;
    setPost(undefined);
    fetchPost(id).then((data) => {
      if (cancelled) return;
      setPost(data && data.status === "published" ? data : null);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (post === undefined) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-white"><Loader2 size={28} className="text-blue-600 animate-spin" /></div>;
  }

  if (post === null) {
    return (
      <>
        <PageMeta title="Post not found | CookIT" />
        <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
          <div className="text-center">
            <p className="text-7xl font-bold text-gray-100">404</p>
            <h1 className="text-2xl font-bold text-gray-900 -mt-4 mb-3">Post not found</h1>
            <p className="text-gray-500 mb-6">This link is invalid or the post was removed.</p>
            <Link to="/posts" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Browse all posts</Link>
          </div>
        </div>
      </>
    );
  }

  const embed = instaEmbed(post.instaLink);

  return (
    <>
      <PageMeta
        title={`${post.title || post.id} | CookIT`}
        description={post.description || `Asset ${post.id} from CookIT.`}
      />
      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/posts" className="text-sm text-gray-400 inline-flex items-center gap-2 hover:text-blue-600 transition-colors mb-8"><ArrowLeft size={15} /> All posts</Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="mx-auto lg:mx-0 w-full max-w-[400px]">
              {embed ? (
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <iframe src={embed} title={post.title || post.id} className="w-full" style={{ height: 640, border: 0 }} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen scrolling="no" />
                </div>
              ) : (
                <a href={post.instaLink} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-blue-600">View on Instagram →</a>
              )}
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-blue-600/70">{post.id}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 leading-snug">{post.title || "Untitled"}</h1>
              {post.description && <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">{post.description}</p>}

              {post.buttons?.length > 0 && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  {post.buttons.map((b, i) => (
                    <a key={i} href={b.url} target="_blank" rel="noopener noreferrer"
                      className={i === 0
                        ? "px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                        : "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-center hover:border-blue-400 hover:text-blue-600 transition-colors"}>
                      {b.label}
                    </a>
                  ))}
                </div>
              )}

              {post.instaLink && (
                <a href={post.instaLink} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 mt-8">
                  View original on Instagram <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

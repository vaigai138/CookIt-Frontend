import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Loader2 } from "lucide-react";

const SITE_ORIGIN = "https://cookit.example";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    setPost(undefined);
    fetch(`/content/blogs/${slug}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPost(data && data.status === "published" ? data : null))
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={30} className="text-blue-600 animate-spin" /></div>;
  }

  if (post === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-gray-900">Article not found</h1>
        <p className="mt-3 text-gray-600">This post doesn't exist or hasn't been published.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-white rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 hover:shadow-xl transition">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    );
  }

  const metaTitle = post.metaTitle || `${post.title} — CookIT Blog`;
  const metaDesc = post.metaDescription || post.excerpt || "";

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
        {post.tags?.length > 0 && <meta name="keywords" content={post.tags.join(", ")} />}
        <meta property="og:title" content={post.metaTitle || post.title} />
        {metaDesc && <meta property="og:description" content={metaDesc} />}
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_ORIGIN}/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${SITE_ORIGIN}/blog/${post.slug}`} />
      </Helmet>

      <article className="bg-white">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft size={15} /> All articles
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {post.tags?.map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">{t}</span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl font-pj">{post.title}</h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{post.author}</span><span>·</span><span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        {/* Cover */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl object-cover" />
          </div>
        )}

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="prose prose-lg max-w-none prose-headings:font-pj prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="p-8 text-center bg-gray-900 rounded-3xl">
            <h3 className="text-2xl font-bold text-white font-pj">Have a project in mind?</h3>
            <p className="mt-2 text-gray-300">Let's talk about how technology can help your business grow.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition">
              Get in touch
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;

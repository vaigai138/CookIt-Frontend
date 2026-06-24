import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Public site origin — used for canonical + og:url. Update when the domain is final.
const SITE_ORIGIN = "https://cookit.example";

// Sensible defaults so every page has baseline SEO even before the admin sets overrides.
const DEFAULT_META = {
  title: "CookIT — Websites, Custom Software, Mobile Apps & AI Automation",
  description:
    "CookIT is a technology solutions company helping businesses digitize, automate, and scale — from business websites to custom software, mobile apps, and AI-powered automation.",
};

// In-memory cache so the admin-editable meta JSON is only fetched once per session.
let cachedMeta = null;

/**
 * Renders per-route <title>/<meta> tags.
 * Priority: admin-edited /content/page-meta.json[path] → DEFAULT_META.
 * The admin Page-Meta editor (Phase 5) writes page-meta.json; until then defaults apply.
 */
export default function PageMeta({ title, description, image }) {
  const { pathname } = useLocation();
  const [pages, setPages] = useState(cachedMeta);

  useEffect(() => {
    if (cachedMeta) return;
    fetch("/content/page-meta.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        cachedMeta = data;
        setPages(data);
      })
      .catch(() => {
        cachedMeta = {};
        setPages({});
      });
  }, []);

  const normalized =
    pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const admin = (pages && (pages[normalized] || pages[pathname])) || {};

  // Prop overrides win over admin-set values, which win over defaults.
  const resolved = {
    title: title || admin.title || DEFAULT_META.title,
    description: description || admin.description || DEFAULT_META.description,
    keywords: admin.keywords,
    ogTitle: admin.ogTitle || title || admin.title || DEFAULT_META.title,
    ogDescription:
      admin.ogDescription || description || admin.description || DEFAULT_META.description,
    ogImage: image || admin.ogImage,
    canonical: admin.canonical || `${SITE_ORIGIN}${normalized}`,
  };

  return (
    <Helmet>
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      {resolved.keywords && <meta name="keywords" content={resolved.keywords} />}
      <meta property="og:title" content={resolved.ogTitle} />
      <meta property="og:description" content={resolved.ogDescription} />
      {resolved.ogImage && <meta property="og:image" content={resolved.ogImage} />}
      <meta property="og:url" content={`${SITE_ORIGIN}${normalized}`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={resolved.canonical} />
    </Helmet>
  );
}

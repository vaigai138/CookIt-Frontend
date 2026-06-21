import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";

// The site routes whose SEO meta can be overridden from the admin.
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/services/business-websites", label: "Service · Business Websites" },
  { path: "/services/custom-software", label: "Service · Custom Software" },
  { path: "/services/mobile-applications", label: "Service · Mobile Applications" },
  { path: "/services/ai-automation", label: "Service · AI & Automation" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/build", label: "AI Solution Builder" },
  { path: "/contact", label: "Contact" },
  { path: "/blog", label: "Blog" },
];

const FIELDS = [
  { key: "title", label: "Title", type: "input" },
  { key: "description", label: "Meta Description", type: "textarea" },
  { key: "keywords", label: "Keywords (comma-separated)", type: "input" },
  { key: "ogTitle", label: "OG Title (social share)", type: "input" },
  { key: "ogDescription", label: "OG Description (social share)", type: "textarea" },
  { key: "ogImage", label: "OG Image URL", type: "input" },
  { key: "canonical", label: "Canonical URL", type: "input" },
];

export default function AdminPageMeta() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cookit_admin_token");
  const [pages, setPages] = useState({});
  const [selected, setSelected] = useState(PAGES[0].path);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin?action=page-meta", { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { navigate("/admin/login"); return; }
        setPages(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, token]);

  const current = pages[selected] || {};
  const setField = (key, value) => setPages((p) => ({ ...p, [selected]: { ...p[selected], [key]: value } }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin?action=save-page-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "save-page-meta", pages }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Meta Tags</h1>
            <p className="text-sm text-gray-500 mt-1">Override the title and meta tags for each page.</p>
          </div>
          <button onClick={save} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
            {saving ? "Saving..." : saved ? "Saved" : "Save All"}
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Loader2 size={26} className="mx-auto text-blue-600 animate-spin" /></div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Page selector */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-2 space-y-1">
                {PAGES.map((p) => (
                  <button key={p.path} onClick={() => setSelected(p.path)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected === p.path ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    {p.label}
                    {pages[p.path] && Object.values(pages[p.path]).some(Boolean) && <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <p className="text-xs font-mono text-gray-400">{selected}</p>
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={current[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} rows={2} className={`${field} resize-none`} />
                  ) : (
                    <input type="text" value={current[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} className={field} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

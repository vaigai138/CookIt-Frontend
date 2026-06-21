import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";
import RichTextEditor from "../../Components/admin/RichTextEditor";

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function BlogEditor() {
  const navigate = useNavigate();
  const { slug: editSlug } = useParams();
  const isEditing = Boolean(editSlug);
  const token = localStorage.getItem("cookit_admin_token");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const coverRef = useRef(null);

  useEffect(() => { if (!slugEdited && !isEditing) setSlug(slugify(title)); }, [title, slugEdited, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin?action=blog&slug=${editSlug}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { navigate("/admin/login"); return; }
        if (!res.ok) throw new Error("Post not found");
        const d = await res.json();
        setTitle(d.title); setSlug(d.slug); setSlugEdited(true);
        setExcerpt(d.excerpt || ""); setContent(d.content || ""); setCoverImage(d.coverImage || "");
        setAuthor(d.author || ""); setTags(d.tags?.join(", ") || "");
        setMetaTitle(d.metaTitle || ""); setMetaDescription(d.metaDescription || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPost(false);
      }
    })();
  }, [editSlug, isEditing, navigate, token]);

  const uploadImage = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        try {
          setUploading(true);
          const res = await fetch("/api/admin?action=upload", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ action: "upload", filename: file.name, data: base64 }),
          });
          const d = await res.json();
          resolve(res.ok ? d.url : null);
          if (!res.ok) alert(d.error || "Upload failed");
        } catch {
          alert("Upload failed.");
          resolve(null);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setCoverImage(url);
  };

  const submit = async (publishStatus) => {
    if (!title.trim() || !content.trim()) { setError("Title and content are required"); return; }
    if (!slug.trim()) { setError("Slug is required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin?action=publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action: "publish", title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim(), content,
          coverImage, author: author.trim() || "CookIT", status: publishStatus,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          metaTitle: metaTitle.trim(), metaDescription: metaDescription.trim(),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to save");
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingPost) {
    return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-blue-600 animate-spin" /></div></AdminLayout>;
  }

  const field = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Post" : "New Post"}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => submit("draft")} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Save Draft</button>
            <button onClick={() => submit("published")} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update Post" : "Publish"}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
        {uploading && <div className="bg-blue-50 border border-blue-200 text-blue-600 text-sm px-4 py-3 rounded-lg mb-4 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Uploading image...</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..."
              className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white" />
            <RichTextEditor content={content} onChange={setContent} onImageUpload={uploadImage} />
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">URL Slug</label>
              <div className="text-sm text-gray-400 mb-1">/blog/</div>
              <input type="text" value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }} className={field} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cover Image</label>
              {coverImage && (
                <div className="relative mb-2">
                  <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded" />
                  <button onClick={() => setCoverImage("")} className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full text-xs hover:bg-black/80">×</button>
                </div>
              )}
              <input type="file" ref={coverRef} accept="image/*" onChange={handleCover} className="hidden" />
              <button onClick={() => coverRef.current?.click()} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
                {coverImage ? "Change Image" : "Upload Cover Image"}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Brief summary for the blog listing..." className={`${field} resize-none`} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className={field} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Technology, Automation" className={field} />
              <p className="text-[10px] text-gray-400 mt-1">Separate with commas</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">SEO</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Meta Title</label>
                  <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Custom page title (optional)" className={field} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Meta Description</label>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} placeholder="Search engine description (optional)" className={`${field} resize-none`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

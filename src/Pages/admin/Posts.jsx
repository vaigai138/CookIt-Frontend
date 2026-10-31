import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Instagram, RefreshCw, Trash2, Plus, X } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";
import { instaEmbed, instaThumb, slugifyId } from "../../utils/postsApi";

const SITE = "https://cookinfo.tech";

const blankPost = () => ({
  id: "", title: "", description: "", instaLink: "",
  buttons: [{ label: "Download", url: "" }], status: "published",
  autoEnabled: true, keywords: "", dmMessage: "", followText: "",
  publicReply: true, commentReplies: "",
});

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors";
const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function AdminPosts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cookit_admin_token");

  const api = async (action, { method = "GET", body } = {}) => {
    const opts = { method, headers: { Authorization: `Bearer ${token}` } };
    if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
    const res = await fetch(`/api/admin?action=${action}`, opts);
    if (res.status === 401) { const e = new Error("Unauthorized"); e.unauthorized = true; throw e; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [origId, setOrigId] = useState(null);

  // Instagram media picker
  const [showPicker, setShowPicker] = useState(false);
  const [igMedia, setIgMedia] = useState(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    api("posts-get")
      .then((d) => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch((err) => { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = async (next) => {
    setSaving(true); setError("");
    try { await api("posts-save", { method: "POST", body: { posts: next } }); setPosts(next); return true; }
    catch (err) { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const startNew = () => { setEditing(blankPost()); setOrigId(null); setError(""); setShowPicker(false); };
  const startEdit = (p) => {
    setEditing({
      ...blankPost(), ...p,
      buttons: p.buttons?.length ? p.buttons : [{ label: "", url: "" }],
      keywords: Array.isArray(p.keywords) ? p.keywords.join(", ") : (p.keywords || ""),
      autoEnabled: p.autoEnabled !== false,
      publicReply: p.publicReply !== false,
      commentReplies: Array.isArray(p.commentReplies) ? p.commentReplies.join("\n") : (p.commentReplies || p.replyComment || ""),
    });
    setOrigId(p.id); setError(""); setShowPicker(false);
  };
  const cancel = () => { setEditing(null); setOrigId(null); setShowPicker(false); };

  const setField = (k, v) => setEditing((e) => ({ ...e, [k]: v }));
  const setButton = (i, k, v) => setEditing((e) => ({ ...e, buttons: e.buttons.map((b, j) => (j === i ? { ...b, [k]: v } : b)) }));
  const addButton = () => setEditing((e) => ({ ...e, buttons: [...e.buttons, { label: "", url: "" }] }));
  const removeButton = (i) => setEditing((e) => ({ ...e, buttons: e.buttons.filter((_, j) => j !== i) }));

  const loadIgMedia = async () => {
    setLoadingMedia(true); setMediaError("");
    try { const d = await api("ig-media"); setIgMedia(Array.isArray(d.media) ? d.media : []); }
    catch (err) { if (err.unauthorized) navigate("/admin/login"); else setMediaError(err.message); }
    finally { setLoadingMedia(false); }
  };
  const openPicker = () => { setShowPicker(true); if (igMedia === null) loadIgMedia(); };
  const pickMedia = (m) => { setField("instaLink", m.permalink); setShowPicker(false); };

  const savePost = async () => {
    const id = slugifyId(editing.id);
    if (!id) { setError("Video ID is required (e.g. CK01)."); return; }
    if (editing.status === "published" && !editing.instaLink.trim()) {
      setError("Add the Instagram link before publishing — or set Status to Draft to save without it.");
      return;
    }
    if (posts.some((p) => slugifyId(p.id) === id && p.id !== origId)) { setError(`Video ID "${id}" already exists.`); return; }
    const now = new Date().toISOString();
    const existing = posts.find((p) => p.id === origId);
    const post = {
      id,
      title: editing.title.trim(),
      description: editing.description,
      instaLink: editing.instaLink.trim(),
      buttons: editing.buttons.map((b) => ({ label: b.label.trim(), url: b.url.trim() })).filter((b) => b.label && b.url),
      status: editing.status || "published",
      autoEnabled: !!editing.autoEnabled,
      keywords: String(editing.keywords || "").split(",").map((s) => s.trim()).filter(Boolean),
      dmMessage: (editing.dmMessage || "").trim(),
      followText: (editing.followText || "").trim(),
      publicReply: !!editing.publicReply,
      commentReplies: String(editing.commentReplies || "").split("\n").map((s) => s.trim()).filter(Boolean),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    const next = origId ? posts.map((p) => (p.id === origId ? post : p)) : [post, ...posts];
    const ok = await persist(next);
    if (ok) { setNotice(`Saved. Live in ~60s at ${SITE}/posts/${id}`); setTimeout(() => setNotice(""), 6000); cancel(); }
  };

  const deletePost = async (p) => {
    if (!confirm(`Delete post "${p.id}"? This cannot be undone.`)) return;
    await persist(posts.filter((x) => x.id !== p.id));
  };

  const copy = (t) => { navigator.clipboard?.writeText(t); setNotice("Link copied."); setTimeout(() => setNotice(""), 2000); };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Instagram comment-automation link pages. Each has a shareable URL you send to commenters.</p>
          </div>
          {!editing && <button onClick={startNew} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">+ New Post</button>}
        </div>

        {notice && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 mb-3 rounded-lg">{notice}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 mb-3 rounded-lg">{error}</div>}

        {editing && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{origId ? "Edit Post" : "New Post"}</h2>
              <div className="flex gap-2">
                <button onClick={cancel} className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={savePost} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving…" : "Save Post"}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Video ID</label>
                <input value={editing.id} onChange={(e) => setField("id", e.target.value)} placeholder="CK01" className={inp} />
                <p className="text-[10px] text-gray-400 mt-1">Public URL: {SITE}/posts/<b>{slugifyId(editing.id) || "ck01"}</b></p>
              </div>
              <div>
                <label className={label}>Status</label>
                <select value={editing.status} onChange={(e) => setField("status", e.target.value)} className={inp}>
                  <option value="published">Published (public)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={label}>Title</label>
                <input value={editing.title} onChange={(e) => setField("title", e.target.value)} placeholder="Post title" className={inp} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Description</label>
                <textarea value={editing.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="What this post is about…" className={`${inp} resize-y`} />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${label} mb-0`}>Instagram link</label>
                  <button type="button" onClick={() => (showPicker ? setShowPicker(false) : openPicker())} className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
                    <Instagram size={13} /> {showPicker ? "Close picker" : "Pick from my Instagram"}
                  </button>
                </div>
                <input value={editing.instaLink} onChange={(e) => setField("instaLink", e.target.value)} placeholder="Paste a link, or pick from your Instagram →" className={`${inp} ${editing.instaLink && !instaEmbed(editing.instaLink) ? "border-red-300" : ""}`} />
                {editing.instaLink && !instaEmbed(editing.instaLink) && <p className="text-[10px] text-red-500 mt-1">Not a recognised Instagram reel/post link.</p>}

                {showPicker && (
                  <div className="mt-2 border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] text-gray-500">Click a post to use it. Shows your published posts (scheduled ones appear once live).</p>
                      <button type="button" onClick={loadIgMedia} disabled={loadingMedia} className="text-[11px] px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-white disabled:opacity-50 inline-flex items-center gap-1"><RefreshCw size={11} /> Refresh</button>
                    </div>
                    {mediaError && <p className="text-[11px] text-red-500 mb-2">{mediaError}</p>}
                    {loadingMedia ? (
                      <div className="py-8 text-center"><Loader2 size={22} className="mx-auto text-blue-600 animate-spin" /></div>
                    ) : igMedia && igMedia.length === 0 ? (
                      <p className="text-[12px] text-gray-400 py-4 text-center">No published posts found.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                        {(igMedia || []).map((m) => {
                          const selected = editing.instaLink === m.permalink;
                          return (
                            <button type="button" key={m.id} onClick={() => pickMedia(m)} title={m.caption || m.permalink}
                              className={`relative block border rounded-lg overflow-hidden ${selected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 hover:border-blue-500"}`}>
                              {m.thumb
                                ? <img src={m.thumb} alt="" className="w-full h-24 object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                                : <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">No preview</div>}
                              {selected && <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] px-1 rounded">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="md:col-span-2">
                <label className={label}>Buttons — label + download/asset link</label>
                <div className="space-y-2">
                  {editing.buttons.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={b.label} onChange={(e) => setButton(i, "label", e.target.value)} placeholder="Button label (e.g. Download)" className={`${inp} w-48 flex-shrink-0`} />
                      <input value={b.url} onChange={(e) => setButton(i, "url", e.target.value)} placeholder="Paste download / asset link (https://…)" className={`${inp} flex-1 min-w-0`} />
                      <button onClick={() => removeButton(i)} className="text-red-400 hover:text-red-600 flex-shrink-0" title="Remove button"><X size={16} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={addButton} className="mt-2 px-3 py-1.5 text-xs font-semibold border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 inline-flex items-center gap-1"><Plus size={12} /> Add button</button>
              </div>

              {/* Thumbnail */}
              <div className="md:col-span-2">
                <label className={label}>Thumbnail (auto from Instagram)</label>
                {instaThumb(editing.instaLink)
                  ? <img src={instaThumb(editing.instaLink)} alt="thumbnail" className="w-40 h-24 object-cover rounded-lg border border-gray-200" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  : <p className="text-[11px] text-gray-400">Paste/pick a valid Instagram link above to preview its thumbnail.</p>}
              </div>

              {/* Comment → DM automation */}
              <div className="md:col-span-2 mt-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Comment → DM automation</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">When someone comments a keyword on this reel, they auto-get a DM with the link.</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none">
                    <input type="checkbox" checked={!!editing.autoEnabled} onChange={(e) => setField("autoEnabled", e.target.checked)} className="w-5 h-5 accent-blue-600" />
                    {editing.autoEnabled ? "On" : "Off"}
                  </label>
                </div>

                <div className={`space-y-3 ${editing.autoEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                  <div>
                    <label className={label}>Trigger keywords (comma-separated)</label>
                    <input value={editing.keywords} onChange={(e) => setField("keywords", e.target.value)} placeholder="send, link, guide, download" className={inp} />
                    <p className="text-[10px] text-gray-400 mt-1">A comment that contains any of these words (case-insensitive) triggers the DM.</p>
                  </div>
                  <div>
                    <label className={label}>DM message (shown above the button)</label>
                    <input value={editing.dmMessage} onChange={(e) => setField("dmMessage", e.target.value)} maxLength={80} placeholder="Hey! Here's the link you asked for 🎁" className={inp} />
                    <p className="text-[10px] text-gray-400 mt-1">Keep it short (max 80 chars). The DM is a card: this line on top, then a tappable <b>button</b> to your post page — the actual link stays hidden behind it.</p>
                  </div>
                  <div>
                    <label className={label}>Follow reminder (under the message)</label>
                    <input value={editing.followText} onChange={(e) => setField("followText", e.target.value)} maxLength={80} placeholder="Follow @cookinfo.tech for more!" className={inp} />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none mb-1.5">
                      <input type="checkbox" checked={!!editing.publicReply} onChange={(e) => setField("publicReply", e.target.checked)} className="w-5 h-5 accent-blue-600" />
                      Also reply publicly under the comment
                    </label>
                    <textarea value={editing.commentReplies} onChange={(e) => setField("commentReplies", e.target.value)} rows={3} disabled={!editing.publicReply} placeholder={"Thanks for commenting! Just sent it to your DMs 📩\nCheck your DMs — sent it over! 💌\nDone ✅ Sent you a DM!"} className={`${inp} resize-y ${!editing.publicReply ? "opacity-50" : ""}`} />
                    <p className="text-[10px] text-gray-400 mt-1">One reply per line. We pick a random one each time so it feels human. Leave blank to use our defaults.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Loader2 size={28} className="mx-auto text-blue-600 animate-spin" /></div>
        ) : posts.length === 0 && !editing ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            <button onClick={startNew} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Create your first post</button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left text-[11px] uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-2 font-semibold">Video ID</th>
                  <th className="px-4 py-2 font-semibold">Title</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/40">
                    <td className="px-4 py-3 font-semibold text-gray-900">{p.id}</td>
                    <td className="px-4 py-3 text-gray-600">{p.title || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded ${p.status === "published" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => copy(`${SITE}/posts/${slugifyId(p.id)}`)} className="text-xs px-2.5 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50">Copy link</button>
                        <a href={`/posts/${slugifyId(p.id)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-2.5 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50">View</a>
                        <button onClick={() => startEdit(p)} className="text-xs px-2.5 py-1 border border-blue-200 rounded text-blue-600 hover:bg-blue-50">Edit</button>
                        <button onClick={() => deletePost(p)} className="text-xs px-2.5 py-1 border border-red-100 rounded text-red-400 hover:text-red-600 hover:border-red-200 inline-flex items-center gap-1"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

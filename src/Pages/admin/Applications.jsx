import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";

const NotesText = ({ text }) => {
  const [open, setOpen] = useState(false);
  const long = (text || "").length > 140;
  return (
    <div>
      <p className={`text-sm text-gray-600 whitespace-pre-wrap break-words ${open ? "" : "line-clamp-2"}`}>{text}</p>
      {long && <button onClick={() => setOpen((v) => !v)} className="text-[11px] font-medium text-blue-600 mt-0.5">{open ? "Show less" : "Show more"}</button>}
    </div>
  );
};

export default function AdminApplications() {
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

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    api("applications")
      .then((d) => setApps(Array.isArray(d) ? d : []))
      .catch((err) => { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}'s application? This cannot be undone.`)) return;
    setBusy(id);
    try { await api("delete-application", { method: "POST", body: { id } }); setApps((a) => a.filter((x) => x.id !== id)); }
    catch (err) { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); }
    finally { setBusy(null); }
  };

  const roles = useMemo(() => [...new Set(apps.map((a) => a.role).filter(Boolean))].sort(), [apps]);
  const filtered = useMemo(() => apps.filter((a) => {
    if (search && !`${a.name} ${a.email} ${a.phone} ${a.skills} ${a.notes}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && a.role !== roleFilter) return false;
    return true;
  }), [apps, search, roleFilter]);

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} of {apps.length} career application{apps.length !== 1 ? "s" : ""}.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4 rounded-lg">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, skills…" className={`${inputCls} sm:col-span-2`} />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="">All roles</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Loader2 size={28} className="mx-auto text-blue-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">{apps.length === 0 ? "No applications yet." : "No applications match these filters."}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{a.name}</p>
                    {a.role && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600">{a.role}</span>}
                    {a.experienceLevel && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{a.experienceLevel}</span>}
                    {a.employmentType && <span className="text-[10px] text-gray-400">{a.employmentType}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-gray-500">
                    {a.email && <a href={`mailto:${a.email}`} className="hover:text-blue-600">{a.email}</a>}
                    {a.phone && <a href={`tel:${a.phone}`} className="hover:text-blue-600">{a.phone}</a>}
                    {a.portfolio && <a href={a.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 inline-flex items-center gap-1">Portfolio/Resume <ExternalLink size={11} /></a>}
                    <span className="text-gray-400">{new Date(a.submittedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(a.id, a.name)} disabled={busy === a.id} className="text-red-400 hover:text-red-600 px-2 py-1.5 border border-red-100 rounded hover:border-red-200 disabled:opacity-50"><Trash2 size={14} /></button>
              </div>
              {a.skills && <p className="text-xs text-gray-500 mt-2"><span className="font-semibold text-gray-600">Skills:</span> {a.skills}</p>}
              {a.notes && <div className="mt-3 border-t border-gray-50 pt-3"><NotesText text={a.notes} /></div>}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

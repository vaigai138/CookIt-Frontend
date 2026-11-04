import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";

const STATUSES = ["new", "contacted", "won", "lost"];
const STATUS_STYLE = {
  new: "bg-blue-50 text-blue-600",
  contacted: "bg-amber-50 text-amber-600",
  won: "bg-green-50 text-green-600",
  lost: "bg-gray-100 text-gray-500",
};

export default function AdminLeads() {
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

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    api("leads")
      .then((d) => setLeads(Array.isArray(d) ? d : []))
      .catch((err) => { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id, status) => {
    setBusy(id);
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try { await api("update-lead", { method: "POST", body: { id, status } }); }
    catch (err) { setLeads(prev); if (err.unauthorized) navigate("/admin/login"); else setError(err.message); }
    finally { setBusy(null); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete lead from ${name}? This cannot be undone.`)) return;
    setBusy(id);
    try { await api("delete-lead", { method: "POST", body: { id } }); setLeads((ls) => ls.filter((l) => l.id !== id)); }
    catch (err) { if (err.unauthorized) navigate("/admin/login"); else setError(err.message); }
    finally { setBusy(null); }
  };

  const sources = useMemo(() => [...new Set(leads.map((l) => l.source).filter(Boolean))].sort(), [leads]);
  const filtered = useMemo(() => leads.filter((l) => {
    if (search && !`${l.name} ${l.email} ${l.phone} ${l.message}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && (l.status || "new") !== statusFilter) return false;
    if (sourceFilter && l.source !== sourceFilter) return false;
    return true;
  }), [leads, search, statusFilter, sourceFilter]);

  const counts = useMemo(() => {
    const c = { new: 0, contacted: 0, won: 0, lost: 0 };
    leads.forEach((l) => { c[l.status || "new"] = (c[l.status || "new"] || 0) + 1; });
    return c;
  }, [leads]);

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} of {leads.length} lead{leads.length !== 1 ? "s" : ""} from the website forms (contact, chatbot, solution builder).</p>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {STATUSES.map((s) => <span key={s} className={`px-2.5 py-1 rounded font-semibold capitalize ${STATUS_STYLE[s]}`}>{s}: {counts[s] || 0}</span>)}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4 rounded-lg">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, message…" className={`${inputCls} lg:col-span-2`} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="">All sources</option>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Loader2 size={28} className="mx-auto text-blue-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">{leads.length === 0 ? "No leads yet. Website form submissions will appear here." : "No leads match these filters."}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{l.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLE[l.status || "new"]}`}>{l.status || "new"}</span>
                    {l.service && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600">{l.service}</span>}
                    {l.source && <span className="text-[10px] text-gray-400">via {l.source}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-gray-500">
                    {l.email && <a href={`mailto:${l.email}`} className="hover:text-blue-600">{l.email}</a>}
                    {l.phone && <a href={`tel:${l.phone}`} className="hover:text-blue-600">{l.phone}</a>}
                    <span className="text-gray-400">{new Date(l.submittedAt).toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={l.status || "new"} onChange={(e) => setStatus(l.id, e.target.value)} disabled={busy === l.id} className={`${inputCls} py-1.5 cursor-pointer capitalize`}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                  <button onClick={() => handleDelete(l.id, l.name)} disabled={busy === l.id} className="text-red-400 hover:text-red-600 px-2 py-1.5 border border-red-100 rounded hover:border-red-200 disabled:opacity-50"><Trash2 size={14} /></button>
                </div>
              </div>
              {l.message && <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap break-words border-t border-gray-50 pt-3">{l.message}</p>}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

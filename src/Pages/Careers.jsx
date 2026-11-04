import React, { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";

const ROLES = ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "Mobile Developer", "UI/UX Designer", "QA / Tester", "AI / Automation", "Other"];
const LEVELS = ["Fresher", "Junior (1-2 yrs)", "Mid (3-5 yrs)", "Senior (5+ yrs)"];
const TYPES = ["Full-time", "Part-time", "Internship", "Freelance"];

const EMPTY = { name: "", email: "", phone: "", role: "", portfolio: "", experienceLevel: "", employmentType: "", skills: "", notes: "" };
const inp = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";

export default function Careers() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || (!form.email.trim() && !form.phone.trim())) { setError("Please add your name and an email or phone."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin?action=submit-application", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setSent(true); setForm(EMPTY);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  return (
    <>
      <PageMeta title="Careers — Join CookIT" description="Join the CookIT team. Apply with your role, experience, portfolio and skills — full-time, part-time, internship or freelance." />
      <PageHero eyebrow="CookIT Careers" title="Build with us" subtitle="We're always looking for sharp people. Tell us about yourself and we'll reach out if it's a fit." />

      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {sent ? (
            <div className="text-center py-16">
              <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application received!</h2>
              <p className="text-gray-500">Thanks for applying — we'll review it and reach out if there's a fit.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className={lbl}>Full name *</label><input value={form.name} onChange={(e) => update("name", e.target.value)} className={inp} placeholder="Your name" required /></div>
                <div><label className={lbl}>Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inp} placeholder="you@email.com" /></div>
                <div><label className={lbl}>Phone</label><input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inp} placeholder="+91 XXXXX XXXXX" /></div>
                <div>
                  <label className={lbl}>Role applying for</label>
                  <select value={form.role} onChange={(e) => update("role", e.target.value)} className={`${inp} cursor-pointer`}>
                    <option value="">Select a role</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Experience level</label>
                  <select value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)} className={`${inp} cursor-pointer`}>
                    <option value="">Select</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Employment type</label>
                  <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className={`${inp} cursor-pointer`}>
                    <option value="">Select</option>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div><label className={lbl}>Portfolio / Resume link</label><input type="url" value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} className={inp} placeholder="https://github.com/… or Drive link" /></div>
              <div><label className={lbl}>Skills / Tech stack</label><input value={form.skills} onChange={(e) => update("skills", e.target.value)} className={inp} placeholder="React, Node.js, Figma, Flutter…" /></div>
              <div><label className={lbl}>Anything else</label><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={4} className={`${inp} resize-none`} placeholder="Notable projects, availability, expectations…" /></div>

              <button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />} {submitting ? "Submitting…" : "Submit application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, Check, Lock, Lightbulb, ListChecks, TrendingUp, Send, CheckCircle2,
} from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = [
  { key: "industry", label: "Your industry", placeholder: "e.g. Restaurant, Real estate, Retail, Clinic...", type: "select",
    options: ["Restaurant & Food", "Real Estate", "Retail & E-commerce", "Healthcare & Clinic", "Media & Creators", "Education", "Manufacturing", "Services", "Other"] },
  { key: "size", label: "Business size", placeholder: "", type: "select",
    options: ["Just me / Solo", "2–10 people", "11–50 people", "51–200 people", "200+ people"] },
  { key: "challenges", label: "What's your biggest challenge right now?", placeholder: "e.g. We track orders on paper and lose them, customers can't book online, too much manual data entry...", type: "textarea" },
  { key: "tools", label: "What tools do you use today?", placeholder: "e.g. WhatsApp, Excel, a basic website, nothing yet...", type: "input" },
  { key: "goal", label: "What would success look like?", placeholder: "", type: "select",
    options: ["Get more customers online", "Save time / reduce manual work", "Manage operations better", "Launch a new product/service", "Improve customer experience", "Not sure — need advice"] },
];

const SolutionBuilder = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ industry: "", size: "", challenges: "", tools: "", goal: "" });
  const [phase, setPhase] = useState("form"); // form | loading | result
  const [blueprint, setBlueprint] = useState(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const canNext = current.key === "tools" ? true : !!answers[current.key].trim();

  const setVal = (v) => setAnswers((p) => ({ ...p, [current.key]: v }));

  const next = () => {
    if (!canNext) return;
    if (isLast) generate();
    else setStep((s) => s + 1);
  };

  const generate = async () => {
    setPhase("loading");
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await r.json();
      if (!r.ok || !data.blueprint) throw new Error(data.error || "Failed");
      setBlueprint(data.blueprint);
      setPhase("result");
    } catch (err) {
      toast.error("Couldn't generate right now. Please try again.", { position: "top-center" });
      setPhase("form");
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <PageMeta
        title="AI Solution Builder — Get a Tailored Blueprint | CookIT"
        description="Answer a few questions about your business and CookIT's AI will sketch a tailored solution blueprint — websites, software, apps, or automation."
      />
      <Toaster />

      <PageHero
        eyebrow="AI Solution Builder"
        title="Tell us about your business. Get a blueprint."
        subtitle="Answer 5 quick questions and our AI will suggest the right kind of solution for you — in under a minute."
      />

      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* ── FORM ── */}
            {phase === "form" && (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-3xl">
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-500">Step {step + 1} of {STEPS.length}</span>
                  <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-600 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <label className="block text-xl font-bold text-gray-900 sm:text-2xl">{current.label}</label>

                    {current.type === "select" && (
                      <div className="mt-5 grid gap-2.5">
                        {current.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setVal(opt)}
                            className={`flex items-center justify-between px-4 py-3 text-left text-sm rounded-xl border transition-all ${
                              answers[current.key] === opt ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {opt}
                            {answers[current.key] === opt && <Check size={16} className="text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}

                    {current.type === "textarea" && (
                      <textarea
                        autoFocus
                        value={answers[current.key]}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={current.placeholder}
                        rows={4}
                        className="mt-5 w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                      />
                    )}

                    {current.type === "input" && (
                      <input
                        autoFocus
                        value={answers[current.key]}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={current.placeholder}
                        className="mt-5 w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-0 transition"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {isLast ? <><Sparkles size={16} /> Generate Blueprint</> : <>Next <ArrowRight size={16} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── LOADING ── */}
            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center bg-gray-50 border border-gray-200 rounded-3xl">
                <Loader2 size={36} className="mx-auto text-blue-600 animate-spin" />
                <p className="mt-5 text-lg font-medium text-gray-900">Analyzing your business...</p>
                <p className="mt-1 text-sm text-gray-500">Our AI is sketching a tailored blueprint.</p>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {phase === "result" && blueprint && (
              <ResultView blueprint={blueprint} answers={answers} onRestart={() => { setStep(0); setPhase("form"); setBlueprint(null); }} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

// ── Result + gated lead capture ──
const ResultView = ({ blueprint, answers, onRestart }) => {
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const change = (e) => {
    setLead((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!lead.name.trim()) next.name = "Required";
    if (!lead.email.trim() || !EMAIL_RE.test(lead.email)) next.email = "Valid email required";
    if (!lead.phone.trim()) next.phone = "Required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      await fetch("/api/send-blueprint-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_name: lead.name, reply_to: lead.email, phone_number: lead.phone, answers, blueprint }),
      });
      setSent(true);
    } catch {
      setSent(true); // fail soft — we still thank them
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Summary */}
      <div className="p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-3xl">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wide">
          <Sparkles size={13} /> Your blueprint
        </span>
        <p className="mt-4 text-lg leading-relaxed text-gray-800">{blueprint.summary}</p>
      </div>

      {/* Recommendations */}
      {blueprint.recommendations?.length > 0 && (
        <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded-3xl">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Lightbulb size={20} className="text-blue-600" /> Recommended for you
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {blueprint.recommendations.map((r, i) => (
              <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="font-semibold text-gray-900">{r.title}</h4>
                {r.why && <p className="mt-1 text-sm text-gray-600">{r.why}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Includes + benefits */}
      <div className="grid gap-6 sm:grid-cols-2">
        {blueprint.includes?.length > 0 && (
          <div className="p-6 bg-white border border-gray-200 rounded-3xl">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900"><ListChecks size={18} className="text-blue-600" /> Could include</h3>
            <ul className="mt-3 space-y-2">
              {blueprint.includes.map((it, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><Check size={15} className="text-blue-600 shrink-0 mt-0.5" />{it}</li>
              ))}
            </ul>
          </div>
        )}
        {blueprint.benefits?.length > 0 && (
          <div className="p-6 bg-white border border-gray-200 rounded-3xl">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900"><TrendingUp size={18} className="text-blue-600" /> Expected benefits</h3>
            <ul className="mt-3 space-y-2">
              {blueprint.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><Check size={15} className="text-blue-600 shrink-0 mt-0.5" />{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Gated full proposal */}
      <div className="relative p-6 sm:p-8 bg-gray-900 rounded-3xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-10 w-72 h-72 bg-blue-600 opacity-20 blur-[100px] rounded-full" />
        </div>
        <div className="relative">
          {!sent ? (
            <>
              <div className="flex items-center gap-2 text-blue-400">
                <Lock size={18} />
                <span className="text-sm font-semibold uppercase tracking-wide">The full plan</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-white">Want the detailed proposal?</h3>
              <p className="mt-2 text-gray-300">
                This is the high-level picture. Share your details and CookIT will prepare your{" "}
                <strong className="text-white">full custom plan</strong> — exact features, approach, timeline, and pricing.
              </p>
              <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-3">
                <div>
                  <input name="name" value={lead.name} onChange={change} placeholder="Name *" className={`w-full bg-white/10 border ${errors.name ? "border-red-400" : "border-white/15"} text-white placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`} />
                </div>
                <div>
                  <input name="email" type="email" value={lead.email} onChange={change} placeholder="Email *" className={`w-full bg-white/10 border ${errors.email ? "border-red-400" : "border-white/15"} text-white placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`} />
                </div>
                <div>
                  <input name="phone" value={lead.phone} onChange={change} placeholder="Phone *" className={`w-full bg-white/10 border ${errors.phone ? "border-red-400" : "border-white/15"} text-white placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`} />
                </div>
                <button type="submit" disabled={sending} className="sm:col-span-3 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-60 transition">
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Sending..." : "Get My Full Proposal"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="mx-auto text-green-400" />
              <h3 className="mt-4 text-2xl font-bold text-white">You're all set!</h3>
              <p className="mt-2 text-gray-300">Our team has your details and your blueprint. We'll reach out shortly with your full custom proposal.</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onRestart} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">↺ Start over</button>
      </div>
    </motion.div>
  );
};

export default SolutionBuilder;

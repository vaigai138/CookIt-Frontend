import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, CheckCircle } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BRAND = { name: "Coco", role: "CookIT Assistant", primary: "#2563EB", bg: "#F8FAFC" };

const INTEREST_OPTIONS = [
  "Business Website",
  "Custom Software",
  "Mobile Application",
  "AI & Automation",
  "Not sure yet",
];

// Sales-oriented system prompt. KEY RULE: give helpful but high-level answers,
// and convert interest into a lead — never hand over a full implementation plan.
const SYSTEM_PROMPT = `You are Coco, the friendly AI assistant on CookIT's website. CookIT is a technology solutions company that helps businesses digitize, automate, and scale.

WHAT COOKIT DOES (four pillars):
1. Business Websites — corporate, restaurant, portfolio sites, and landing pages.
2. Custom Software — CRM systems, inventory systems, admin dashboards, internal tools.
3. Mobile Applications — Android, iOS, customer portals, cross-platform apps.
4. AI & Automation — AI chatbots, workflow automation, lead management systems, smart integrations.
CookIT was founded in 2025 and builds custom solutions tailored to each business — not generic products.

RESPONSE STYLE:
- Keep replies SHORT and warm (1-3 sentences for casual chat). Talk like a helpful colleague, not a brochure.
- Never dump everything unprompted. If someone says "hi", greet them back briefly.
- Use **bold** only for the 4 pillar names. No markdown headers or long bullet lists.
- An occasional emoji is fine.

SALES RULE — VERY IMPORTANT:
- You may explain WHAT CookIT can do and the general benefits, but keep ideas high-level and common.
- NEVER give a detailed, step-by-step implementation plan, full architecture, exact tech stack, precise timeline, or pricing. Those require talking to the CookIT team.
- If the user wants specifics, a quote, a detailed plan, or seems ready, encourage them to share their details so the team can prepare a tailored proposal — and append [CONTACT_FORM] at the END of that reply.
- Include [CONTACT_FORM] whenever the user signals intent: "I want", "interested", "get a quote", "build me", "how much", "contact", "talk to someone", "book a call", "I need a website/app/software".
- Only include [CONTACT_FORM] ONCE per conversation. After the form is submitted, just say the team will reach out.
- For pure knowledge questions ("what do you do?"), answer first; only attach the form when intent appears.

If you don't know something, suggest they reach out to the CookIT team. Be encouraging and helpful.`;

const QUICK = [
  "What does CookIT do?",
  "I need a website",
  "Can you build custom software?",
  "Tell me about AI automation",
];

// ── Inline lead form ──
const LeadForm = ({ onSubmitted, onSkip, initialInterest = "" }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: initialInterest });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const change = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.interest.trim()) next.interest = "Please pick one";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    fetch("/api/send-chatbot-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_name: form.name,
        reply_to: form.email,
        phone_number: form.phone,
        interest: form.interest,
        message: `CHATBOT LEAD\n- Name: ${form.name}\n- Email: ${form.email}\n- Phone: ${form.phone}\n- Interest: ${form.interest}`,
      }),
    })
      .then(() => { setSent(true); onSubmitted(form.name); })
      .catch(() => { setSent(true); onSubmitted(form.name); })
      .finally(() => setSending(false));
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle size={22} className="text-green-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-green-800">Sent! Our team will reach out soon.</p>
      </div>
    );
  }

  const cls = (err) =>
    `w-full bg-gray-50 border ${err ? "border-red-400" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">Share your details</p>
      <form onSubmit={submit} className="space-y-2">
        <div>
          <input name="name" placeholder="Your name *" value={form.name} onChange={change} className={cls(errors.name)} />
          {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
        </div>
        <div>
          <input name="email" type="email" placeholder="Email *" value={form.email} onChange={change} className={cls(errors.email)} />
          {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
        </div>
        <div>
          <input name="phone" type="tel" placeholder="Phone *" value={form.phone} onChange={(e) => { if (/^[0-9+\s-]*$/.test(e.target.value)) change(e); }} className={cls(errors.phone)} />
          {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
        </div>
        <div>
          <select name="interest" value={form.interest} onChange={change} className={`${cls(errors.interest)} ${form.interest ? "text-gray-900" : "text-gray-400"}`}>
            <option value="">What do you need? *</option>
            {INTEREST_OPTIONS.map((o) => <option key={o} value={o} className="text-gray-900">{o}</option>)}
          </select>
          {errors.interest && <p className="text-[10px] text-red-500 mt-0.5">{errors.interest}</p>}
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={sending} className="flex-1 text-white text-sm font-medium py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {sending && <Loader2 size={14} className="animate-spin" />}
            {sending ? "Sending..." : "Submit"}
          </button>
          <button type="button" onClick={onSkip} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">Skip</button>
        </div>
      </form>
    </motion.div>
  );
};

// ── Main chatbot ──
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hey! I'm Coco from CookIT 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [formMsgId, setFormMsgId] = useState(null);
  const [formDone, setFormDone] = useState(false);
  const [interest, setInterest] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, formMsgId]);

  const detectInterest = (t = "") => {
    const s = t.toLowerCase();
    if (/website|landing|web\s?site|corporate site/.test(s)) return "Business Website";
    if (/software|crm|inventory|dashboard|internal tool/.test(s)) return "Custom Software";
    if (/app|android|ios|mobile|portal/.test(s)) return "Mobile Application";
    if (/\bai\b|automat|chatbot|workflow|lead manage/.test(s)) return "AI & Automation";
    return "";
  };

  const askAI = async (userMessage, history) => {
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-18).map((m) => ({ role: m.role, content: m.content.replace(/\[CONTACT_FORM\]/g, "").trim() })),
      { role: "user", content: userMessage },
    ];
    try {
      const r = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      if (!r.ok) {
        return "I'm having a brief hiccup 😅 You can reach our team through the Contact page and we'll get right back to you.";
      }
      const data = await r.json();
      return data?.content || "Could you rephrase that?";
    } catch {
      return "I'm having trouble connecting. Please try the Contact page and we'll respond quickly!";
    }
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setShowQuick(false);
    setInput("");
    setMessages((p) => [...p, { id: Date.now(), role: "user", content: msg }]);
    setLoading(true);

    const reply = await askAI(msg, messages);
    const id = Date.now() + 1;

    const userIntent = /\b(want|need|interested|quote|price|cost|build|hire|book|call|contact|get started|sign\s?up|how much)\b/i.test(msg);
    const aiForm = reply.includes("[CONTACT_FORM]");
    const showForm = !formDone && !formMsgId && (aiForm || userIntent);

    setMessages((p) => [...p, { id, role: "assistant", content: reply }]);
    if (showForm) {
      setFormMsgId(id);
      const guess = detectInterest(msg) || detectInterest(reply);
      if (guess) setInterest(guess);
    }
    setLoading(false);
  };

  const onSubmitted = (name) => {
    setFormDone(true);
    setFormMsgId(null);
    setMessages((p) => [...p, { id: Date.now(), role: "assistant", content: name ? `Thanks ${name}! Our team has your details and will be in touch shortly. Anything else I can help with? 😊` : "Got it! The team will reach out soon. Anything else?" }]);
  };
  const onSkip = () => {
    setFormMsgId(null);
    setMessages((p) => [...p, { id: Date.now(), role: "assistant", content: "No problem! You can always reach us via the Contact page. What else can I help with?" }]);
  };

  const render = (text) => {
    const cleaned = text.replace(/\[CONTACT_FORM\]/g, "").trim();
    return cleaned.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      return part.split("\n").map((line, j) => <React.Fragment key={`${i}-${j}`}>{j > 0 && <br />}{line}</React.Fragment>);
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="w-[calc(100vw-2rem)] sm:w-[400px] h-[70vh] sm:h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center text-white shrink-0" style={{ backgroundColor: BRAND.primary }}>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/15 font-bold">C
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 rounded-full" style={{ borderColor: BRAND.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{BRAND.name}</h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider">{BRAND.role}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full"><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: BRAND.bg }}>
              {messages.map((m) => (
                <React.Fragment key={m.id}>
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${m.role === "user" ? "text-white rounded-2xl rounded-tr-none" : "bg-white text-slate-700 border border-gray-200/60 rounded-2xl rounded-tl-none"}`}
                      style={m.role === "user" ? { backgroundColor: BRAND.primary } : {}}
                    >
                      {render(m.content)}
                    </div>
                  </div>
                  {formMsgId === m.id && (
                    <div className="flex justify-start">
                      <div className="max-w-[92%] w-full">
                        <LeadForm onSubmitted={onSubmitted} onSkip={onSkip} initialInterest={interest} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "75ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick chips */}
            {showQuick && (
              <div className="px-4 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors">{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                <button type="submit" disabled={!input.trim() || loading} className="text-white p-2.5 rounded-lg disabled:opacity-40 hover:opacity-90 flex items-center justify-center min-w-[42px]" style={{ backgroundColor: BRAND.primary }}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <p className="text-[10px] text-gray-300 text-center mt-2">Powered by CookIT</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 0 0 0 rgba(37,99,235,0.6)", "0 0 0 10px rgba(37,99,235,0)", "0 0 0 0 rgba(37,99,235,0)"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: BRAND.primary }}
        aria-label="Open chat"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </motion.button>
    </div>
  );
};

export default ChatBot;

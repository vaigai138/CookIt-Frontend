import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, Loader2, Clock, MessageSquare, Search, Wrench } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import AuroraBackground from "../Components/ui/AuroraBackground";
import Highlight from "../Components/ui/Highlight";

const SERVICE_OPTIONS = ["Business Website", "Custom Software", "Mobile Application", "AI & Automation", "Digital Marketing", "Not sure yet"];

// TODO: replace with real contact details (kept in sync with the footer).
const CONTACT = {
  email: "hello@cookinfo.tech",
  phone: "+91 9597337699",
  location: "Tamil Nadu, India",
  hours: "Mon – Sat, 9am – 7pm",
};

const STEPS = [
  { icon: MessageSquare, title: "You reach out", text: "Tell us about your business and what you need." },
  { icon: Search, title: "We discuss", text: "A quick call to understand your goals and scope." },
  { icon: Wrench, title: "We build", text: "A tailored proposal, then we get to work in clear milestones." },
];

const initialForm = { name: "", email: "", phone: "", service: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: form.name, reply_to: form.email, phone_number: form.phone,
          interest: form.service || "General Inquiry", message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Message sent! We'll be in touch soon.", { position: "top-center" });
      setForm(initialForm);
    } catch {
      toast.error("Couldn't send right now. Please email us directly.", { position: "top-center" });
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

  return (
    <>
      <PageMeta title="Contact CookIT — Let's Build Something" description="Get in touch with CookIT to discuss your website, custom software, mobile app, or automation project." />
      <Toaster />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-24 text-center">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" /> Contact
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-pj text-balance">
            Let's <Highlight>build something</Highlight> together
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl text-pretty">
            Tell us what you're trying to achieve — we'll get back to you with the right next step, usually within a day.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-5 lg:items-start">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="relative grain overflow-hidden p-7 rounded-3xl bg-gray-950 text-white">
              <div className="pointer-events-none absolute -top-20 -right-12 w-64 h-64 rounded-full blur-[90px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.5), transparent 65%)" }} />
              <div className="relative">
                <h2 className="text-xl font-bold">Get in touch</h2>
                <p className="mt-2 text-sm text-gray-400">Prefer to reach out directly? Use any of these.</p>
                <ul className="mt-6 space-y-4 text-sm">
                  {[
                    { icon: Mail, val: CONTACT.email, href: `mailto:${CONTACT.email}` },
                    { icon: Phone, val: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
                    { icon: MapPin, val: CONTACT.location },
                    { icon: Clock, val: CONTACT.hours },
                  ].map(({ icon: Icon, val, href }) => (
                    <li key={val} className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-9 h-9 glass-dark rounded-lg shrink-0"><Icon size={16} className="text-blue-400" /></span>
                      {href ? <a href={href} className="hover:underline">{val}</a> : <span>{val}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What happens next */}
            <div className="p-7 bg-white border border-gray-200 rounded-3xl">
              <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">What happens next</h3>
              <ol className="mt-5 space-y-5">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 shrink-0"><s.icon size={18} /></span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{i + 1}. {s.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="lg:col-span-3 p-8 bg-white border border-gray-200 rounded-3xl shadow-premium"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name *" required className={inputCls} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address *" required className={inputCls} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className={inputCls} />
              <select name="service" value={form.service} onChange={handleChange} className={`${inputCls} ${form.service ? "text-gray-900" : "text-gray-400"}`}>
                <option value="">What do you need? *</option>
                {SERVICE_OPTIONS.map((o) => <option key={o} value={o} className="text-gray-900">{o}</option>)}
              </select>
            </div>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us a bit about your project *" required className={`${inputCls} mt-4 resize-none`} />
            <button type="submit" disabled={sending} className="btn-primary mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {sending ? "Sending..." : "Send Message"}
            </button>
            <p className="mt-3 text-xs text-center text-gray-400">We'll only use your details to respond to your enquiry.</p>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default Contact;

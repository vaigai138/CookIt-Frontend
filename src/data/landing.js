// Centralized content for the landing page. Editing copy here keeps the section
// components presentational. Icons are referenced by name and mapped inside
// each component (lucide-react) to keep this file plain data.

// ── Section 3: Services — 4 pillars ──
export const PILLARS = [
  {
    id: "business-websites",
    icon: "Globe",
    title: "Business Websites",
    tagline: "A digital storefront that builds trust and converts.",
    items: ["Corporate Websites", "Restaurant Websites", "Portfolio Websites", "Landing Pages"],
    href: "/services/business-websites",
  },
  {
    id: "custom-software",
    icon: "Code2",
    title: "Custom Software",
    tagline: "Systems built around how your business actually works.",
    items: ["CRM Systems", "Inventory Systems", "Admin Dashboards", "Internal Tools"],
    href: "/services/custom-software",
  },
  {
    id: "mobile-applications",
    icon: "Smartphone",
    title: "Mobile Applications",
    tagline: "Put your business in your customers' pockets.",
    items: ["Android Apps", "iOS Apps", "Customer Portals", "Cross-platform Apps"],
    href: "/services/mobile-applications",
  },
  {
    id: "ai-automation",
    icon: "Sparkles",
    title: "AI & Automation",
    tagline: "Let software handle the repetitive work, at scale.",
    items: ["AI Chatbots", "Workflow Automation", "Lead Management Systems", "Smart Integrations"],
    href: "/services/ai-automation",
  },
];

// Secondary offering — supports the core pillars.
export const SECONDARY_SERVICES = [
  { icon: "Megaphone", title: "Digital Marketing", text: "SEO, social media, and paid campaigns to bring customers to what we build." },
  { icon: "Palette", title: "Branding & Design", text: "Logos, brand identity, and graphics that make you look the part." },
  { icon: "Search", title: "SEO Optimization", text: "Get found on Google with technical and content SEO done right." },
];

// ── Section 4: How We Work ──
export const PROCESS = [
  {
    step: "01",
    icon: "Search",
    title: "Discover",
    text: "We start by understanding your business, your customers, and the real problems worth solving.",
  },
  {
    step: "02",
    icon: "PenTool",
    title: "Design",
    text: "We map the solution and design an experience that's clean, intuitive, and on-brand.",
  },
  {
    step: "03",
    icon: "Code2",
    title: "Build",
    text: "We develop with modern, scalable technology — shipping in focused milestones you can see.",
  },
  {
    step: "04",
    icon: "Rocket",
    title: "Launch & Grow",
    text: "We deploy, support, and keep improving — so your solution grows as your business does.",
  },
];

// ── Section 6: Industries We Serve ──
export const INDUSTRIES = [
  { icon: "Building2", name: "Real Estate" },
  { icon: "UtensilsCrossed", name: "Restaurants & Food" },
  { icon: "Stethoscope", name: "Healthcare & Clinics" },
  { icon: "Clapperboard", name: "Media & Creators" },
  { icon: "ShoppingBag", name: "Retail & E-commerce" },
  { icon: "Rocket", name: "Startups" },
];

// ── Section 7: Why CookIT ──
export const WHY_COOKIT = [
  {
    icon: "PencilRuler",
    title: "Custom-Built, Not Generic",
    text: "Every solution is shaped around your workflow — no forcing your business into off-the-shelf software.",
  },
  {
    icon: "Layers",
    title: "One Partner, End to End",
    text: "Websites, software, mobile, and automation under one roof — no juggling multiple vendors.",
  },
  {
    icon: "Gauge",
    title: "Built to Scale",
    text: "Modern, maintainable tech that grows with you instead of needing a rebuild in a year.",
  },
  {
    icon: "MessagesSquare",
    title: "Clear Communication",
    text: "Plain language, visible progress, and dedicated support — you always know where things stand.",
  },
];

// ── Section 9: Testimonials ──
// NOTE: `placeholder: true` quotes are stand-ins — swap in the real review text
// as it arrives (keep the name/role).
export const TESTIMONIALS = [
  {
    quote:
      "CookIT delivered a website that genuinely reflects our brand and made it easy for clients to explore our properties. Professional, responsive, and a pleasure to work with throughout.",
    name: "Kadamban Group",
    role: "Real Estate",
    featured: true,
    placeholder: true,
  },
  {
    quote:
      "They understood exactly what our agency needed and built a site that shows off our work beautifully. Smooth process from start to finish.",
    name: "KV Media Works",
    role: "Media Agency",
    placeholder: true,
  },
  {
    quote:
      "Our new website made our menu and brand look fantastic online. Customers find us easily now — exactly what we hoped for.",
    name: "Thalaiyatti Biriyani",
    role: "Restaurant",
    placeholder: true,
  },
];

// ── Section 2: Trust ──
// Real, honest numbers — small but true builds more trust than inflated claims.
export const TRUST_STATS = [
  { value: "2+", label: "Businesses Served" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "Web + Software", label: "Solutions Delivered" },
  { value: "Chennai, India", label: "Where We're Based" },
];

export const TRUST_CLIENTS = [
  { name: "Kadamban Group", url: "https://kadambangroup.com/", note: "Real Estate" },
  { name: "KV Media Works", url: "https://kvmediaworks.in/", note: "Media Agency" },
  { name: "Thalaiyatti Biriyani", url: "https://thalaiyattibiriyani.com/", note: "Restaurant" },
];

// ── FAQ ──
export const FAQS = [
  {
    question: "What exactly does CookIT do?",
    answer:
      "We're a technology solutions company. We build business websites, custom software (like CRMs, inventory systems and dashboards), mobile apps, and AI-powered automation — all tailored to how your business actually works.",
  },
  {
    question: "I just need a website. Can you still help?",
    answer:
      "Absolutely. Websites are a core offering — corporate sites, restaurant sites, portfolios, and landing pages. And if your needs grow later, we can extend into software, apps, or automation with the same team.",
  },
  {
    question: "Do you build custom software or only use templates?",
    answer:
      "We build custom. Instead of forcing your business into off-the-shelf software, we design systems around your real workflows — so the tools fit the way you already operate.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A focused website typically takes 1–3 weeks. Custom software and apps depend on scope — after a short discovery call we give you a clear timeline broken into milestones you can see.",
  },
  {
    question: "What does it cost?",
    answer:
      "Every solution is custom, so pricing depends on what you need. Tell us about your business through our contact form or AI blueprint tool and we'll put together a tailored proposal — no obligation.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. We deploy, support, and keep improving your solution over time — so it grows with your business instead of going stale.",
  },
];

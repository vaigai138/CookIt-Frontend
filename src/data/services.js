// Detailed content for the 4 service pillars. Keyed by URL slug.
// Rendered by src/Pages/ServiceDetail.jsx; summarized on src/Pages/Services.jsx.

export const SERVICES = {
  "business-websites": {
    icon: "Globe",
    title: "Business Websites",
    tagline: "A digital storefront that builds trust and turns visitors into customers.",
    intro:
      "Your website is often the first impression a customer gets. We design and build fast, modern, mobile-friendly websites that reflect your brand and make it easy for people to choose you.",
    offerings: [
      { name: "Corporate Websites", text: "Professional multi-page sites that establish credibility and showcase your services." },
      { name: "Restaurant Websites", text: "Menu-driven sites with online presence, gallery, and reservation/ordering links." },
      { name: "Portfolio Websites", text: "Clean, visual sites for creators and agencies to display their best work." },
      { name: "Landing Pages", text: "High-converting single pages built for campaigns, launches, and lead generation." },
    ],
    benefits: [
      "Mobile-first, responsive on every device",
      "Fast loading and SEO-friendly",
      "Easy-to-update content",
      "Built to convert visitors into enquiries",
    ],
    outcome: "A website that works as hard as you do — credible, fast, and built to grow your business.",
  },

  "custom-software": {
    icon: "Code2",
    title: "Custom Software",
    tagline: "Systems built around how your business actually works.",
    intro:
      "Off-the-shelf software forces you to change how you operate. We do the opposite — we build software around your real workflows, so your team works faster with fewer mistakes.",
    offerings: [
      { name: "CRM Systems", text: "Track leads, customers, and deals in one place tailored to your sales process." },
      { name: "Inventory Systems", text: "Real-time stock, suppliers, and order management that fits your operations." },
      { name: "Admin Dashboards", text: "Clear, data-rich dashboards to monitor and run your business at a glance." },
      { name: "Internal Tools", text: "Custom tools that automate the repetitive work your team does every day." },
    ],
    benefits: [
      "Designed around your exact workflow",
      "Removes manual, error-prone busywork",
      "Centralizes your data in one place",
      "Scales as your business grows",
    ],
    outcome: "Software that fits like a glove — less manual work, fewer errors, more time to grow.",
  },

  "mobile-applications": {
    icon: "Smartphone",
    title: "Mobile Applications",
    tagline: "Put your business in your customers' pockets.",
    intro:
      "A great mobile app keeps you close to your customers and your team. We build smooth, reliable apps for Android and iOS — and customer portals that extend your service beyond the website.",
    offerings: [
      { name: "Android Apps", text: "Native-quality Android apps built for performance and reach." },
      { name: "iOS Apps", text: "Polished iPhone and iPad apps that meet Apple's standards." },
      { name: "Customer Portals", text: "Secure portals where customers manage orders, bookings, and accounts." },
      { name: "Cross-platform Apps", text: "One codebase, both platforms — faster to build and easier to maintain." },
    ],
    benefits: [
      "Smooth, app-store-ready experiences",
      "One codebase options to save cost",
      "Push notifications & offline support",
      "Connected to your existing systems",
    ],
    outcome: "An app your customers actually want to use — and that strengthens loyalty over time.",
  },

  "ai-automation": {
    icon: "Sparkles",
    title: "AI & Automation",
    tagline: "Let software handle the repetitive work, at scale.",
    intro:
      "The right automation frees your team from repetitive tasks and helps you respond to customers instantly. We add practical AI and automation where it creates real, measurable value.",
    offerings: [
      { name: "AI Chatbots", text: "Smart assistants that answer questions and capture leads around the clock." },
      { name: "Workflow Automation", text: "Connect your tools so routine tasks happen automatically." },
      { name: "Lead Management Systems", text: "Capture, qualify, and route leads so none slip through the cracks." },
      { name: "Smart Integrations", text: "Tie together the apps you already use into one connected flow." },
    ],
    benefits: [
      "Respond to customers 24/7",
      "Eliminate repetitive manual tasks",
      "Never lose a lead again",
      "Free your team for higher-value work",
    ],
    outcome: "More done with less effort — automation that works quietly in the background while you grow.",
  },
};

// Ordered list for the overview page + navigation.
export const SERVICE_ORDER = [
  "business-websites",
  "custom-software",
  "mobile-applications",
  "ai-automation",
];

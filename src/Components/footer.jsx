import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa";

// ── Footer config ──
// TODO: replace contact details + social URLs with the real ones.
const CONTACT = {
  email: "hello@cookinfo.tech",
  phone: "+91 9597337699",
  location: "Tamil Nadu, India",
};

const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/cook-info-tech/", icon: FaLinkedinIn },
  { name: "Instagram", href: "https://www.instagram.com/cookinfo.tech?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==", icon: FaInstagram },
  { name: "WhatsApp", href: "https://wa.me/9597337699", icon: FaWhatsapp },
];

const SERVICE_LINKS = [
  { label: "Business Websites", to: "/services/business-websites" },
  { label: "Custom Software", to: "/services/custom-software" },
  { label: "Mobile Applications", to: "/services/mobile-applications" },
  { label: "AI & Automation", to: "/services/ai-automation" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
  { label: "Build with AI", to: "/build" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-400">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl font-pj">
              Let's build something that grows your business.
            </h3>
            <p className="mt-2 text-gray-400">
              Tell us what you need — we'll turn it into a plan.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition duration-200 shrink-0"
          >
            Start a Project
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" aria-label="CookIT home">
              <img src="/logo.png" alt="CookIT" className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
              CookIT is a technology solutions company helping businesses digitize, automate, and
              scale — through websites, custom software, mobile apps, and AI-powered automation.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex items-center justify-center w-9 h-9 text-gray-300 bg-white/5 border border-white/10 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Services</h4>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Company</h4>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={16} className="text-blue-500 shrink-0" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} className="text-blue-500 shrink-0" />
                {CONTACT.location}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">© {year} CookIT. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

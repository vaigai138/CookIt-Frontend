import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-3 sm:px-4 transition-all duration-500 ease-out ${scrolled ? "pt-3 sm:pt-4" : "pt-2 sm:pt-3"}`}>
      <div
        className={`mx-auto rounded-2xl transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-5xl glass-strong shadow-premium ring-1 ring-black/5"
            : "max-w-6xl bg-transparent"
        }`}
      >
        <div className={`flex items-center justify-between px-4 transition-all duration-500 ${scrolled ? "h-14" : "h-16 sm:h-20"}`}>
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="CookIT home">
            <img className="w-auto h-8 sm:h-9" src="/logo.png" alt="CookIT" />
          </Link>

          {/* Desktop nav — pill */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-blue-700" : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 shadow-glow hover:-translate-y-0.5 transition-all duration-200"
            >
              Get in touch
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden text-gray-900"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-200/60"
            >
              <div className="px-3 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `block px-3 py-3 text-base font-medium rounded-xl transition-colors ${
                        isActive ? "text-blue-700 bg-blue-50" : "text-gray-800 hover:bg-gray-100"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 mt-2 px-5 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-b from-blue-500 to-blue-600"
                >
                  Get in touch <ArrowRight size={16} />
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;

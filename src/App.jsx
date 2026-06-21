import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./Components/Layout";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import ServiceDetail from "./Pages/ServiceDetail";
import Portfolio from "./Pages/Portfolio";
import Contact from "./Pages/Contact";
import SolutionBuilder from "./Pages/SolutionBuilder";
import Blog from "./Pages/Blog";
import BlogPost from "./Pages/BlogPost";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import Placeholder from "./Pages/Placeholder";
import AdminRoute from "./Components/admin/AdminRoute";

// Admin is lazy-loaded so its heavy editor (TipTap) stays out of the public bundle.
const AdminLogin = lazy(() => import("./Pages/admin/Login"));
const AdminDashboard = lazy(() => import("./Pages/admin/Dashboard"));
const BlogEditor = lazy(() => import("./Pages/admin/BlogEditor"));
const AdminPageMeta = lazy(() => import("./Pages/admin/PageMeta"));
const AdminSettings = lazy(() => import("./Pages/admin/Settings"));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <div className="app-container bg-gray-50">
      <ScrollToTop />
      <Routes>
        {/* Admin (no public chrome) — lazy-loaded behind a Suspense fallback */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense></AdminRoute>} />
        <Route path="/admin/new" element={<AdminRoute><Suspense fallback={<AdminFallback />}><BlogEditor /></Suspense></AdminRoute>} />
        <Route path="/admin/edit/:slug" element={<AdminRoute><Suspense fallback={<AdminFallback />}><BlogEditor /></Suspense></AdminRoute>} />
        <Route path="/admin/seo" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminPageMeta /></Suspense></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense></AdminRoute>} />

        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/build" element={<SolutionBuilder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Placeholder title="Page not found" subtitle="The page you're looking for doesn't exist or has moved." />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

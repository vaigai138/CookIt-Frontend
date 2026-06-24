import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, PlusCircle, Search, Settings, LogOut, Menu } from "lucide-react";

const NAV_ITEMS = [
  { label: "All Posts", path: "/admin", icon: FileText },
  { label: "New Post", path: "/admin/new", icon: PlusCircle },
  { label: "SEO Meta Tags", path: "/admin/seo", icon: Search },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("cookit_admin_token");
    localStorage.removeItem("cookit_admin_user");
    navigate("/admin/login");
  };

  const username = localStorage.getItem("cookit_admin_user") || "Admin";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg text-white text-xs font-bold">C</div>
              <div>
                <p className="text-sm font-bold text-gray-900">CookIT</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    active ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full text-xs font-bold text-blue-600">{username[0]?.toUpperCase()}</div>
              <span className="text-sm text-gray-700 font-medium">{username}</span>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="text-gray-500"><Menu size={22} /></button>
          <span className="text-sm font-bold text-gray-900">CookIT Admin</span>
          <button onClick={logout} className="text-gray-400 hover:text-red-500"><LogOut size={18} /></button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Loader2, FileText } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem("cookit_admin_token");

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin?action=blogs", { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { localStorage.removeItem("cookit_admin_token"); navigate("/admin/login"); return; }
      setBlogs(await res.json());
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch("/api/admin?action=delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "delete", slug }),
      });
      if (res.ok) setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  const drafts = blogs.filter((b) => b.status === "draft");

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {blogs.length} post{blogs.length !== 1 ? "s" : ""}{drafts.length > 0 && ` · ${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link to="/admin/new" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Loader2 size={28} className="mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading posts...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No blog posts yet</p>
          <Link to="/admin/new" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.slug} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {blog.coverImage && <img src={blog.coverImage} alt="" className="w-10 h-10 object-cover rounded shrink-0" />}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{blog.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${blog.status === "published" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{blog.status}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-500">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/edit/${blog.slug}`} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 border border-blue-100 hover:border-blue-300 rounded">Edit</Link>
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded">View</a>
                      <button onClick={() => handleDelete(blog.slug, blog.title)} disabled={deleting === blog.slug} className="text-xs font-medium text-red-400 hover:text-red-600 px-3 py-1.5 border border-red-100 rounded disabled:opacity-50">
                        {deleting === blog.slug ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

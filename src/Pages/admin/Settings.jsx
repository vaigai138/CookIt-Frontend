import React, { useState } from "react";
import { Loader2, Check, ShieldCheck } from "lucide-react";
import AdminLayout from "../../Components/admin/AdminLayout";

// Password change via emailed OTP (server sends a 6-digit code to the admin email).
export default function AdminSettings() {
  const token = localStorage.getItem("cookit_admin_token");
  const [step, setStep] = useState("request"); // request | verify | done
  const [otpToken, setOtpToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const requestOtp = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin?action=send-otp", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: "send-otp" }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to send OTP");
      setOtpToken(d.otpToken); setMaskedEmail(d.maskedEmail); setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!otp || !newPassword) { setError("Enter the OTP and a new password"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin?action=change-password", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: "change-password", otp, otpToken, newUsername, newPassword }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setMessage(d.message || "Updated."); setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Change your admin username and password.</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5 text-blue-600">
            <ShieldCheck size={20} />
            <h2 className="text-base font-bold text-gray-900">Change Credentials</h2>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>}

          {step === "request" && (
            <>
              <p className="text-sm text-gray-600 mb-4">We'll email a one-time code to your registered admin email to confirm it's you.</p>
              <button onClick={requestOtp} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />} Send OTP
              </button>
            </>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Code sent to <strong>{maskedEmail}</strong>. Enter it below with your new details.</p>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" className={field} />
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New username (optional)" className={field} />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className={field} />
              <button onClick={changePassword} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />} Update Credentials
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <Check size={36} className="mx-auto text-green-500 mb-3" />
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

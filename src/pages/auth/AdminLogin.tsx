import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign in
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      // 2. Check Role
      // Note: By default, users sign up as 'user'.
      // To make an Admin, you must manually edit the user in Supabase Dashboard -> Authentication -> Users -> Edit User -> Metadata: { "role": "admin" }
      const role = data.user?.user_metadata?.role;

      if (role !== "admin") {
        // Not an admin? Sign them out immediately.
        await supabase.auth.signOut();
        throw new Error(
          "Access denied. You do not have administrator privileges."
        );
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center mb-4">
        <div className="mx-auto w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-100">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Admin Portal</h2>
        <p className="mt-2 text-gray-500">
          Restricted access for store managers
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-2 text-sm animate-fade-in">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail
              size={18}
              className="text-gray-400 group-focus-within:text-red-500 transition-colors"
            />
          </div>
          <input
            type="email"
            placeholder="Admin Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock
              size={18}
              className="text-gray-400 group-focus-within:text-red-500 transition-colors"
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Access Dashboard"
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-6 w-full text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          &larr; Back to Customer Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;

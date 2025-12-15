import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  User as UserIcon,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateInputs = () => {
    const trimmedEmail = email.trim();

    // 1. Validate Email format - STRICT Regex for Gmail
    // Ensures:
    // - Starts with valid characters (letters, numbers, dots, etc.)
    // - Contains @gmail.com strictly at the end
    // - Prevents cases like "user@gmai.com" or just "@gmail.com"
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(trimmedEmail)) {
      return "Invalid email format. Please enter a valid address ending in @gmail.com";
    }

    // 2. Validate Password length - Must be >= 6 chars
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    // 3. Validate Full Name (Only for Registration)
    if (!isLogin && fullName.trim().length < 3) {
      return "Full Name must be at least 3 characters long.";
    }

    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Run Synchronous Validation
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const trimmedEmail = email.trim();

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) throw error;
        // Successful login will trigger onAuthStateChange in AuthContext
        navigate("/");
      } else {
        // --- REGISTER LOGIC ---
        const trimmedName = fullName.trim();

        // Check for duplicate name in profiles table
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("full_name")
          .ilike("full_name", trimmedName)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking name uniqueness:", checkError);
        }

        if (existingUser) {
          throw new Error(
            "This name is already taken. Please choose another one."
          );
        }

        // Create a default avatar based on the name
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          trimmedName
        )}&background=random`;

        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedName,
              avatar_url: avatarUrl,
              role: "user", // Default role matches DB constraint
            },
          },
        });
        if (error) throw error;

        setSuccessMessage(
          "Account created successfully! Please check your email for verification."
        );
        setIsLogin(true);
        // Clear sensitive fields but keep email for convenience
        setPassword("");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.message === "Invalid login credentials") {
        setError("Incorrect email or password. Please try again.");
      } else if (err.message.includes("User already registered")) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(
          err.message ||
            "Authentication failed. Please check your network connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {isLogin ? "Welcome Back" : "Join SunStyle"}
        </h2>
        <p className="mt-2 text-gray-500">
          {isLogin ? "Sign in via Supabase Auth" : "Create your account"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="w-full space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-2 text-sm animate-fade-in">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-xl flex items-start gap-2 text-sm animate-fade-in">
            <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {!isLogin && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon
                size={18}
                className="text-gray-400 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Full Name (min 3 chars)"
              required={!isLogin}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail
              size={18}
              className="text-gray-400 group-focus-within:text-primary-500 transition-colors"
            />
          </div>
          <input
            type="email"
            placeholder="Email address (@gmail.com)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock
              size={18}
              className="text-gray-400 group-focus-within:text-primary-500 transition-colors"
            />
          </div>
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 w-full text-center">
        <p className="text-sm text-gray-500 mb-2">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setSuccessMessage(null);
            if (!isLogin) setFullName("");
          }}
          className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
        >
          {isLogin ? "Register now" : "Sign in to existing account"}
        </button>

        <div className="mt-8">
          <Link
            to="/admin/login"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Access Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

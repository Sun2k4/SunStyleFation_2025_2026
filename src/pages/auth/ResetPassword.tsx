import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Lock,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Listen for the PASSWORD_RECOVERY event from Supabase
    // when user clicks the reset link in their email
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, _session) => {
                if (event === "PASSWORD_RECOVERY") {
                    setSessionReady(true);
                    setCheckingSession(false);
                }
            }
        );

        // Also check if there's already an active session (e.g. page reload)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSessionReady(true);
            }
            setCheckingSession(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            console.error("Update password error:", err);
            setError(
                err.message || "Không thể cập nhật mật khẩu. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    // Loading state while checking session
    if (checkingSession) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="animate-spin text-primary-500" size={32} />
                <p className="text-gray-500 text-sm">Đang xác thực...</p>
            </div>
        );
    }

    // No valid recovery session
    if (!sessionReady) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        Liên kết không hợp lệ
                    </h2>
                    <p className="mt-2 text-gray-500">
                        Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
                        Vui lòng yêu cầu liên kết mới.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Link
                        to="/forgot-password"
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all text-center shadow-lg shadow-gray-900/20"
                    >
                        Yêu cầu liên kết mới
                    </Link>
                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Đặt lại mật khẩu
                </h2>
                <p className="mt-2 text-gray-500">
                    Nhập mật khẩu mới cho tài khoản của bạn
                </p>
            </div>

            {success ? (
                <div className="w-full space-y-6">
                    <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
                        <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">Mật khẩu đã được cập nhật!</p>
                            <p>
                                Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát...
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Đăng nhập ngay
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-2 text-sm animate-fade-in">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock
                                size={18}
                                className="text-gray-400 group-focus-within:text-primary-500 transition-colors"
                            />
                        </div>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            placeholder="Xác nhận mật khẩu mới"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        ) : (
                            "Cập nhật mật khẩu"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;

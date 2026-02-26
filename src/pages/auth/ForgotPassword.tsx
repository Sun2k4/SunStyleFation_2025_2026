import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedEmail = email.trim();
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(trimmedEmail)) {
            setError("Vui lòng nhập email hợp lệ có đuôi @gmail.com");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError(
                err.message || "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Quên mật khẩu?
                </h2>
                <p className="mt-2 text-gray-500">
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </p>
            </div>

            {success ? (
                <div className="w-full space-y-6">
                    <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
                        <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">Email đã được gửi!</p>
                            <p>
                                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{" "}
                                <strong>{email}</strong>. Vui lòng kiểm tra hộp thư
                                (bao gồm cả thư rác).
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Quay lại đăng nhập
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
                            <Mail
                                size={18}
                                className="text-gray-400 group-focus-within:text-primary-500 transition-colors"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Địa chỉ email (@gmail.com)"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            "Gửi liên kết đặt lại"
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;

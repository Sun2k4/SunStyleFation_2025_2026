import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail('');
    };

    return (
        <section className="bg-gray-900 py-20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-6">
                        <Mail size={28} className="text-primary-400" />
                    </div>

                    {/* Text */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Stay in the Loop
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                        Subscribe to get exclusive offers, style tips, and early access to new arrivals. No spam, we promise!
                    </p>

                    {/* Form */}
                    {isSubmitted ? (
                        <div className="flex items-center justify-center gap-3 text-green-400 animate-fade-in">
                            <CheckCircle size={24} />
                            <span className="text-lg font-medium">Thank you for subscribing! 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Subscribe
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Trust Badge */}
                    <p className="text-gray-500 text-sm mt-6">
                        🔒 Your email is safe with us. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

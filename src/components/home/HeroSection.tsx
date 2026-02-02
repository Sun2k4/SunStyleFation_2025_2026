import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, Pause } from 'lucide-react';

interface CountdownProps {
    targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex gap-3">
            {[
                { value: timeLeft.days, label: t('hero.days') },
                { value: timeLeft.hours, label: t('hero.hours') },
                { value: timeLeft.minutes, label: t('hero.mins') },
                { value: timeLeft.seconds, label: t('hero.secs') },
            ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center">
                    <div className="text-2xl font-bold text-white">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const HeroSection: React.FC = () => {
    const { t } = useTranslation();
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Sale ends in 7 days from now
    const saleEndDate = new Date();
    saleEndDate.setDate(saleEndDate.getDate() + 7);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const videoUrl = "/videos/Fashion_Woman_Walking_City_Street.mp4";
    const fallbackImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

    return (
        <section className="relative h-[700px] md:h-[800px] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {!isMobile ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ display: isVideoPlaying ? 'block' : 'none' }}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                ) : null}
                <img
                    src={fallbackImage}
                    alt="Hero Background"
                    className={`w-full h-full object-cover ${!isMobile && isVideoPlaying ? 'hidden' : 'block'}`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Video Toggle (Desktop only) */}
            {!isMobile && (
                <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="absolute bottom-6 right-6 z-20 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
                    aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                >
                    {isVideoPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                </button>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Sale Banner */}
                <div className="mb-8 animate-fade-in">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        <span className="animate-pulse">🔥</span>
                        <span>{t('hero.saleBanner')}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-slide-up">
                        {t('hero.title1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                            SunStyle
                        </span>
                        <br />
                        {t('hero.title2')}
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed animate-slide-up animation-delay-200">
                        {t('hero.subtitle')}
                    </p>

                    {/* Countdown */}
                    <div className="mb-8 animate-slide-up animation-delay-300">
                        <p className="text-white/80 text-sm mb-3 uppercase tracking-wider">{t('hero.saleEnds')}</p>
                        <Countdown targetDate={saleEndDate} />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                        <Link
                            to="/shop"
                            className="group bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-2"
                        >
                            {t('hero.shopNow')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/shop?category=new"
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center justify-center"
                        >
                            {t('hero.newArrivals')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/70 rounded-full animate-scroll"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;


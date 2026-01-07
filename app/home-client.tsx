"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Mic,
    Zap,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Menu,
    X,
    Lock,
    Mail,
    User as UserIcon,
    LogOut,
    ChevronDown
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const LogoIcon = ({ className }: { className?: string }) => (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
        <Image
            src="/Tonetta - No Text-Photoroom.png"
            alt="Tonetta Icon"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 40px, 48px"
        />
    </div>
);

const Counter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [target, duration]);

    return <span>{count}%</span>;
};

const AuthModal = ({ isOpen, onClose, initialMode = "signup" }: { isOpen: boolean; onClose: () => void; initialMode?: "signin" | "signup" }) => {
    const [mode, setMode] = useState<"signin" | "signup">(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        setMode(initialMode);
        setMessage(null);
        setEmail("");
        setPassword("");
    }, [initialMode, isOpen]);

    const toggleMode = () => {
        setMode(mode === 'signup' ? 'signin' : 'signup');
        setMessage(null);
        setEmail("");
        setPassword("");
    };

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) {
                    if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
                        setMessage({ type: 'error', text: "Account already exists. Please sign in instead." });
                    } else {
                        throw error;
                    }
                    return;
                }

                // Handle case where identities is empty (user already exists but Supabase returns silent success)
                if (data?.user?.identities?.length === 0) {
                    setMessage({ type: 'error', text: "Account already exists. Please sign in instead." });
                    return;
                }

                setMessage({ type: 'success', text: "Account created successfully! Welcome to Tonetta." });
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                setMessage({ type: 'success', text: "Successfully signed in! Redirecting..." });
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        } catch (err) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message || "An error occurred during authentication." });
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message || "An error occurred during Google Sign-In." });
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-brand-navy/5 max-h-[95vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-brand-navy/40 hover:text-brand-navy transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto flex-1 p-5 md:p-8">
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <LogoIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-brand-navy mb-1">
                            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                        </h3>
                        <p className="text-xs text-brand-navy/60">
                            {mode === 'signup'
                                ? 'Join Tonetta.ai and start mastering your tone today.'
                                : 'Sign in to your account to continue.'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white border border-brand-navy/10 hover:bg-background-light hover:border-brand-navy/20 transition-all font-bold text-brand-navy active:scale-[0.98] text-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-navy/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-white px-4 text-brand-navy/20">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-3">
                            <div className="min-h-[16px]">
                                {message && (
                                    <div className={`p-2.5 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {message.text}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy/40 mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-navy/20 w-4 h-4" />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-6 py-3 rounded-2xl bg-background-light border border-brand-navy/5 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 focus:outline-none transition-all placeholder:text-brand-navy/20 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy/40 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-navy/20 w-4 h-4" />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-6 py-3 rounded-2xl bg-background-light border border-brand-navy/5 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 focus:outline-none transition-all placeholder:text-brand-navy/20 text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-brand-navy text-white py-4 rounded-2xl font-black text-base hover:bg-brand-navy/90 transition-all active:scale-[0.98] shadow-xl shadow-brand-navy/10 flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {mode === 'signup' ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-brand-navy/40">
                                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{" "}
                                <button
                                    onClick={toggleMode}
                                    className="font-bold text-brand-accent hover:underline"
                                >
                                    {mode === 'signup' ? 'Sign In' : 'Create Account'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function HomeClient({ initialUser }: { initialUser: User | null }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
    const [user, setUser] = useState<User | null>(initialUser);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Create a stable Supabase client instance
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);

            // Force a refresh after sign in to ensure UI updates
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Handle Auth Redirects (Success/Error)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authSuccess = params.get('auth_success');
        const authError = params.get('auth_error');

        if (authSuccess) {
            if (!user) {
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setUser(session?.user ?? null);
                });
            }
            setTimeout(() => setIsAuthOpen(true), 0);
            window.history.replaceState({}, '', window.location.pathname);
        } else if (authError) {
            setTimeout(() => setIsAuthOpen(true), 0);
            alert(`Authentication Error: ${authError}`);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [supabase.auth, user]); // Only run on mount

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsUserMenuOpen(false);
        setUser(null); // Explicitly clear user on sign out
        window.location.reload(); // Hard reload to clear server props
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background-light text-brand-navy selection:bg-brand-navy/10">
            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4 glass shadow-sm" : "py-6 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <LogoIcon className="w-10 h-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-brand-navy">tonetta.ai</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#problem" className="text-sm font-medium hover:text-brand-accent transition-colors">Problem</a>
                        <a href="#features" className="text-sm font-medium hover:text-brand-accent transition-colors">Features</a>
                        <a href="#integrations" className="text-sm font-medium hover:text-brand-accent transition-colors">Integrations</a>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-full border border-brand-navy/5 hover:bg-white hover:shadow-md transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                                        <UserIcon size={16} className="text-brand-accent" />
                                    </div>
                                    <span className="text-sm font-bold text-brand-navy">{user.email?.split('@')[0]}</span>
                                    <ChevronDown size={16} className={`text-brand-navy/30 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-brand-navy/5 p-2 z-20 animate-fade-in scale-in-center">
                                            <div className="px-4 py-3 border-b border-brand-navy/5 mb-1">
                                                <p className="text-xs font-bold text-brand-navy/30 uppercase tracking-widest mb-1">Signed in as</p>
                                                <p className="text-sm font-bold text-brand-navy truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                                            >
                                                <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setAuthMode("signin");
                                        setIsAuthOpen(true);
                                    }}
                                    className="text-sm font-bold text-brand-navy hover:text-brand-accent transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        setAuthMode("signup");
                                        setIsAuthOpen(true);
                                    }}
                                    className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-navy/90 transition-all active:scale-95 shadow-lg shadow-brand-navy/10"
                                >
                                    Create Account
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-brand-navy"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-brand-navy/5 p-6 flex flex-col gap-4 animate-fade-in">
                        <a href="#problem" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Problem</a>
                        <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#integrations" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Integrations</a>
                        {user ? (
                            <>
                                <div className="py-2 border-b border-brand-navy/5">
                                    <p className="text-xs font-bold text-brand-navy/30 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-brand-navy">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-lg font-bold text-red-600 py-2"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setAuthMode("signin");
                                        setIsAuthOpen(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-lg font-medium text-left"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        setAuthMode("signup");
                                        setIsAuthOpen(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="bg-brand-navy text-white px-6 py-3 rounded-full font-semibold"
                                >
                                    Create Account
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold tracking-wider uppercase mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                            </span>
                            Real-Time Tone Intelligence
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-brand-navy tracking-tight leading-[1.1] mb-8 animate-fade-in">
                            Match their tone. <br />
                            <span className="text-brand-accent">Win their trust.</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-navy/70 leading-relaxed mb-12 animate-fade-in [animation-delay:200ms]">
                            The first AI-powered tone analysis platform designed for modern sales teams.
                            Understand every nuance, mirror their energy, and close deals faster.
                        </p>

                        <div className="flex justify-center animate-fade-in [animation-delay:400ms]">
                            <button
                                onClick={() => {
                                    if (user) {
                                        // Could scroll to features or dashboard
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        setAuthMode("signup");
                                        setIsAuthOpen(true);
                                    }
                                }}
                                className="group bg-brand-navy text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-navy/90 transition-all hover:shadow-xl hover:shadow-brand-navy/20 active:scale-95"
                            >
                                {user ? 'View Features' : 'Get Started for Free'}
                                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-12 bg-background-cream/50 border-y border-brand-navy/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left animate-slide-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                                <span className="text-4xl font-black text-brand-accent mb-2"><Counter target={38} /></span>
                                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">of communication is tone</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left animate-slide-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                                <span className="text-4xl font-black text-brand-accent mb-2"><Counter target={55} /></span>
                                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">body language lost in remote calls</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left animate-slide-up [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
                                <span className="text-4xl font-black text-brand-accent mb-2">Real-time</span>
                                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">tone analysis & coaching</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section id="problem" className="py-24 md:py-32 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-16 text-center">
                                The Problem: <span className="text-brand-accent/70">Words Aren&apos;t Enough</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    "Remote work eliminates 55% of body language cues",
                                    "Sales reps are blind to how they sound to customers",
                                    "Billions lost due to poor delivery and tone mismatch"
                                ].map((text, i) => (
                                    <div key={i} className="glass p-8 rounded-3xl group hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-500 hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                                            <CheckCircle2 size={24} className="text-brand-accent group-hover:text-white" />
                                        </div>
                                        <p className="text-lg font-bold leading-tight text-brand-navy">
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 md:py-32 bg-background-cream/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-6">Revolutionize Your Sales Calls</h2>
                            <p className="text-lg text-brand-navy/60">Advanced AI technology to help you sound your best, every time.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-accent/10 border-white/50">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-colors duration-300">
                                    <Mic className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy mb-4">Live Tone Matching</h3>
                                <p className="text-brand-navy/60 leading-relaxed">
                                    Real-time analysis of prospect tone and sentiment. Get instant visual cues on how to adjust your pitch for maximum rapport.
                                </p>
                            </div>

                            <div className="glass p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-accent/10 border-white/50">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-colors duration-300">
                                    <Zap className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy mb-4">Instant Feedback</h3>
                                <p className="text-brand-navy/60 leading-relaxed">
                                    Avoid monotone delivery or aggressive pacing. Tonetta.ai nudges you during the call to keep your energy perfectly balanced.
                                </p>
                            </div>

                            <div className="glass p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-accent/10 border-white/50">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-colors duration-300">
                                    <TrendingUp className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy mb-4">Performance Analytics</h3>
                                <p className="text-brand-navy/60 leading-relaxed">
                                    Post-call breakdowns of your tone performance. Track improvement over time and identify winning speech patterns.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integration Section */}
                <section id="integrations" className="py-24 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-16">Works Where You Work</h2>

                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                            {["Zoom", "Microsoft Teams", "Outreach", "Apollo"].map((tool) => (
                                <div
                                    key={tool}
                                    className="px-8 py-4 rounded-2xl bg-white border border-brand-navy/5 text-lg font-bold text-brand-navy/80 hover:border-brand-accent hover:text-brand-accent hover:shadow-lg hover:shadow-brand-accent/5 transition-all duration-300 cursor-default"
                                >
                                    {tool}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 md:pb-32">
                    <div className="container mx-auto">
                        <div className="relative overflow-hidden rounded-[3rem] bg-brand-navy p-12 md:p-24 text-center">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent blur-[120px] rounded-full -mr-48 -mt-48 opacity-40 shrink-0" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent-light blur-[120px] rounded-full -ml-48 -mb-48 opacity-20 shrink-0" />

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                                    {user ? "Ready to dominate?" : "Ready to transform"} <br className="hidden md:block" />
                                    {user ? "Start using Tonetta." : "your conversations?"}
                                </h2>
                                <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
                                    {user
                                        ? `Welcome back, ${user.email?.split('@')[0]}. You're ready to master the art of tone.`
                                        : "Join other high-performing sales teams using Tonetta.ai to master the art of tone."}
                                </p>
                                {!user && (
                                    <button
                                        onClick={() => {
                                            setAuthMode("signup");
                                            setIsAuthOpen(true);
                                        }}
                                        className="bg-white text-brand-navy px-10 py-5 rounded-full text-xl font-black hover:bg-background-light transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                                    >
                                        Create Your Account
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-brand-navy/5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <LogoIcon className="w-8 h-8" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-brand-navy">tonetta.ai</span>
                    </div>
                    <div className="text-sm font-medium text-brand-navy/40">
                        © 2025 Tonetta.ai. All rights reserved. Built for champions.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-sm font-bold text-brand-navy/60 hover:text-brand-accent transition-colors">Privacy</a>
                        <a href="#" className="text-sm font-bold text-brand-navy/60 hover:text-brand-accent transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
}

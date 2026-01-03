"use client";

import React, { useEffect, useState } from "react";
import {
  Mic,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";

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

const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.result === 'success') {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-brand-navy/5">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-brand-navy/40 hover:text-brand-navy transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LogoIcon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-brand-navy mb-4">Join the Waitlist</h3>
                <p className="text-brand-navy/60">Be the first to master your tone and close more deals with Tonetta.ai.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/40 mb-2 ml-1">Full Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-background-light border border-brand-navy/5 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 focus:outline-none transition-all placeholder:text-brand-navy/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/40 mb-2 ml-1">Work Email</label>
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                    className="w-full px-6 py-4 rounded-2xl bg-background-light border border-brand-navy/5 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 focus:outline-none transition-all placeholder:text-brand-navy/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/40 mb-2 ml-1">Role / Company</label>
                  <input
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Sales Leader @ Acme Inc."
                    className="w-full px-6 py-4 rounded-2xl bg-background-light border border-brand-navy/5 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 focus:outline-none transition-all placeholder:text-brand-navy/20"
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-navy text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-navy/90 transition-all active:scale-[0.98] shadow-xl shadow-brand-navy/10 flex items-center justify-center gap-2 group mt-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Get Early Access
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-brand-navy/30 mt-6 px-4">
                  By joining, you agree to receive early access updates. We respect your inbox.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-brand-accent" />
              </div>
              <h3 className="text-3xl font-black text-brand-navy mb-4">You&apos;re on the list!</h3>
              <p className="text-brand-navy/60 mb-8 leading-relaxed">
                Thank you for your interest. We&apos;ll reach out to you at the provided email as soon as we&apos;re ready for you.
              </p>
              <button
                onClick={onClose}
                className="text-sm font-bold text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                Back to site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

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
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-navy/90 transition-all active:scale-95 shadow-lg shadow-brand-navy/10"
            >
              Get Early Access
            </button>
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
            <button
              onClick={() => {
                setIsWaitlistOpen(true);
                setMobileMenuOpen(false);
              }}
              className="bg-brand-navy text-white px-6 py-3 rounded-full font-semibold"
            >
              Get Early Access
            </button>
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
                onClick={() => setIsWaitlistOpen(true)}
                className="group bg-brand-navy text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-navy/90 transition-all hover:shadow-xl hover:shadow-brand-navy/20 active:scale-95"
              >
                Get Early Access
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
                <span className="text-4xl font-black text-brand-accent mb-2">38%</span>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">of communication is tone</p>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left animate-slide-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                <span className="text-4xl font-black text-brand-accent mb-2">55%</span>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">body language lost in remote</p>
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

        {/* Logo Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-navy/30 mb-4 animate-fade-in">Our Identity</h2>
            </div>
            <div className="relative w-full aspect-[2/1] md:aspect-[3/1] rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-navy/5 border border-brand-navy/5 animate-fade-in bg-white/50">
              <Image
                src="/Tonetta Logo-Photoroom.png"
                alt="Tonetta Brand Banner"
                fill
                className="object-contain p-12 md:p-20"
                priority
              />
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
                  Ready to transform <br className="hidden md:block" />
                  your conversations?
                </h2>
                <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
                  Join 500+ high-performing sales teams using Tonetta.ai to master the art of tone.
                </p>
                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-white text-brand-navy px-10 py-5 rounded-full text-xl font-black hover:bg-background-light transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                >
                  Get Early Access
                </button>
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
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}

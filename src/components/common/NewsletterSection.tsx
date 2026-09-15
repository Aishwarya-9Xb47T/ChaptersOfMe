import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Feather } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from './Toast';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.subscribe(email);
      showToast(res.message, 'success');
      setSubscribed(true);
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative my-20">
      <div className="relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE1] rounded-3xl border border-amberGold-300/70 p-8 sm:p-12 lg:p-16 shadow-md overflow-hidden">
        {/* Subtle decorative ornaments */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amberGold-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-rosewood-200/20 blur-3xl pointer-events-none" />
        
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amberGold-100 text-amberGold-800 border border-amberGold-300 mb-5 shadow-sm">
            <Feather className="w-5 h-5" />
          </div>

          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
            Quiet Letters & Stanzas
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 tracking-tight mb-4 leading-tight">
            Read My Writings as They Unfold
          </h2>

          <p className="text-ink-600 text-base sm:text-lg leading-relaxed mb-8">
            Subscribe to receive occasional notes, raw drafts, student life epiphanies, and new poems before they appear anywhere else. No marketing noise—only quiet reflections from my journal to your heart.
          </p>

          {subscribed ? (
            <div className="bg-amberGold-50 border border-amberGold-300 rounded-2xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8 text-amberGold-600 mb-2" />
              <h3 className="font-serif text-xl font-bold text-ink-900">Welcome to My Readers Circle</h3>
              <p className="text-sm text-ink-600 mt-1">
                Thank you for inviting my words into your inbox. Look forward to our first letter soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your favorite email address..."
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-parchment-300 rounded-xl text-ink-900 text-sm placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 focus:border-transparent transition shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="py-3.5 px-7 bg-ink-900 text-parchment-50 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition duration-300 flex items-center justify-center gap-2 shadow hover:shadow-md disabled:opacity-50 whitespace-nowrap"
              >
                <span>{loading ? 'Subscribing...' : 'Join the Journal'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amberGold-300" />
              </button>
            </form>
          )}

          <p className="text-xs text-ink-400 mt-4">
            Unsubscribe whenever you wish. Your address remains private and strictly guarded.
          </p>
        </div>
      </div>
    </section>
  );
};

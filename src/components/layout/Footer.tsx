import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../common/Toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.subscribe(email);
      showToast(res.message || 'Subscribed successfully!', 'success');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Failed to subscribe', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Poetry',
    'Life & Lessons',
    'Family',
    'Dreams',
    'Student Life',
    'Personal Growth',
  ];

  return (
    <footer className="bg-[#FAF6F0] border-t border-parchment-200 mt-28 relative overflow-hidden">
      {/* Decorative top border with gradient */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-amberGold-400/60 to-transparent w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & Author Intro */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-parchment-100 border border-amberGold-400/80 flex items-center justify-center text-amberGold-700 shadow-sm">
                  <Feather className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-ink-950">
                    Chapters of Me
                  </h3>
                  <span className="font-serif italic text-xs tracking-wider text-amberGold-800 block -mt-0.5">
                    by N. S. Aishwarya
                  </span>
                </div>
              </div>

              <p className="text-amberGold-900/90 font-serif italic text-lg mb-3 leading-snug">
                "Poems, thoughts, stories, and everything in between."
              </p>
              <p className="text-ink-600 text-sm leading-relaxed max-w-sm mb-5">
                A quiet haven created by <strong className="text-ink-900 font-semibold">N. S. Aishwarya</strong>. 
                Dedicated to raw emotions, student reflections, gentle verse, and the courage to live authentically.
              </p>

              {/* Direct Author Contact Box */}
              <div className="inline-flex items-center gap-2 p-2 px-3.5 rounded-xl bg-[#FFFDF9] border border-parchment-300/80 text-xs shadow-xs">
                <Mail className="w-4 h-4 text-amberGold-700 flex-shrink-0" />
                <span className="text-ink-500 font-medium">Reach the author:</span>
                <a
                  href="mailto:nsaishwarya777@gmail.com"
                  className="font-semibold text-amberGold-900 hover:text-amberGold-700 underline underline-offset-2 transition"
                >
                  nsaishwarya777@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-parchment-200/80">
              <span className="text-xs tracking-wider uppercase text-ink-500 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amberGold-600" />
                An Independent Digital Journal & Sanctuary
              </span>
            </div>
          </div>

          {/* Categories / Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg font-semibold text-ink-900 mb-4 border-b border-parchment-300/60 pb-2">
              Explore Chapters
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/writings?category=${encodeURIComponent(cat)}`}
                    className="text-ink-600 hover:text-amberGold-800 transition flex items-center justify-between group py-0.5"
                  >
                    <span>{cat}</span>
                    <span className="text-xs text-parchment-400 group-hover:translate-x-1 group-hover:text-amberGold-700 transition duration-200">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-lg font-semibold text-ink-900 mb-2">
                Quiet Letters in Your Inbox
              </h4>
              <p className="text-xs text-ink-600 leading-relaxed mb-4">
                Receive new poems, reflective notes, and unpublished thoughts directly to your inbox. No spam, ever.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF9] border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 focus:border-transparent transition shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-ink-900 text-parchment-50 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Subscribing...' : 'Subscribe to Musings'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500 pt-4 border-t border-parchment-200/80">
              <Link to="/about" className="hover:text-amberGold-800 transition">
                About the Writer
              </Link>
              <span>•</span>
              <Link to="/writings" className="hover:text-amberGold-800 transition">
                All Writings
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-amberGold-800 transition">
                Leave a Note
              </Link>
              <span>•</span>
              <Link to="/admin" className="hover:text-amberGold-800 transition font-medium">
                Author Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-parchment-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-500 gap-4">
          <p>© {new Date().getFullYear()} Chapters of Me by N. S. Aishwarya. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Written from the heart, penned with</span>
            <Heart className="w-3.5 h-3.5 text-rosewood-500 fill-rosewood-500 inline" />
            <span>and honest reflection.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

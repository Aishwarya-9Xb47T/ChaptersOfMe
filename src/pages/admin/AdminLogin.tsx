import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('nsaishwarya777@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      showToast(`Too many failed attempts. Please wait ${waitSec}s.`, 'error');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      showToast('Authentication successful. Welcome back, N. S. Aishwarya!', 'success');
      navigate('/admin');
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 30000); // 30 second temporary cooldown
        showToast('Too many failed attempts. Temporary lockout for 30s.', 'error');
      } else {
        showToast(err.message || 'Invalid email or password', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockedUntil ? Date.now() < lockedUntil : false;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-parchment-200/90 p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-parchment-100 border border-amberGold-400 flex items-center justify-center text-amberGold-700 shadow-sm mx-auto mb-3">
              <ShieldCheck className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink-950">
              Author Studio
            </h1>
            <p className="text-xs text-ink-500 uppercase tracking-widest mt-1">
              Chapters of Me • Secure Portal
            </p>
          </div>

          {isLocked && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>Studio is temporarily locked due to repeated attempts. Please wait 30 seconds.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                Author Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nsaishwarya777@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-amberGold-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                Studio Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your studio password"
                  className="w-full pl-10 pr-10 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-amberGold-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-3 px-4 bg-ink-900 text-parchment-50 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-5"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Unlock Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Assurance Badge */}
          <div className="mt-6 pt-5 border-t border-parchment-200 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-parchment-100 border border-parchment-300 text-[11px] text-ink-600 font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted Session • Author Access Only</span>
            </div>
            <div>
              <Link
                to="/"
                className="text-xs text-ink-500 hover:text-amberGold-800 transition font-medium"
              >
                ← Return to Chapters of Me Journal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Feather, Sparkles, Mail } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/common/Toast';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Reflection',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const subjects = [
    'General Reflection',
    'Response to a Poem',
    'Student Life & Sharing Experiences',
    'Collaboration or Inquiries',
    'Just Saying Hello',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (!formData.email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendContact(formData);
      showToast(res.message, 'success');
      setSent(true);
      setFormData({
        name: '',
        email: '',
        subject: 'General Reflection',
        message: '',
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
          Letters & Connections
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-950 tracking-tight mb-4">
          Leave a Note
        </h1>
        <p className="text-ink-600 text-base sm:text-lg leading-relaxed">
          Whether you felt touched by a verse, want to share your own student story, or just wish to exchange words of warmth, my inbox is always open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Information Card */}
        <div className="md:col-span-5 bg-[#FAF6F0] rounded-3xl border border-parchment-200 p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-parchment-300">
            <div className="w-10 h-10 rounded-full bg-parchment-100 border border-amberGold-400 flex items-center justify-center text-amberGold-700 shadow-sm">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-950">
                N. S. Aishwarya
              </h3>
              <p className="text-xs text-ink-500 uppercase tracking-widest">
                Writer & Creator
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-ink-700 leading-relaxed">
            <p className="italic font-serif text-base text-amberGold-900">
              "Every message received from a reader feels like finding a quiet stone skipped across an ocean."
            </p>
            <p>
              I personally read and cherish every message that arrives here. If your reflection calls for a response, I will reply with all my care.
            </p>
          </div>

          <div className="pt-4 border-t border-parchment-300 space-y-3 text-xs text-ink-600">
            <a
              href="mailto:nsaishwarya777@gmail.com"
              className="flex items-center gap-2 p-2 rounded-xl bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 text-ink-800 transition group"
            >
              <Mail className="w-4 h-4 text-amberGold-600 flex-shrink-0 group-hover:scale-110 transition" />
              <span className="font-medium">nsaishwarya777@gmail.com</span>
            </a>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amberGold-600 flex-shrink-0" />
              <span>Replies usually sent within 48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amberGold-600 flex-shrink-0" />
              <span>Direct personal inbox</span>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="md:col-span-7 bg-[#FFFDF9] rounded-3xl border border-parchment-200 p-8 sm:p-10 shadow-sm">
          {sent ? (
            <div className="text-center py-10 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-amberGold-100 text-amberGold-700 border border-amberGold-300 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-ink-950 mb-2">
                Thank You for Writing
              </h3>
              <p className="text-ink-600 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Your message has been delivered to my quiet inbox. I look forward to reading your words.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2.5 bg-ink-900 text-parchment-50 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="How should I address you?"
                  className="w-full px-4 py-3 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Where can I reach you back?"
                  className="w-full px-4 py-3 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                  Theme / Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                  Your Letter or Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Pour your thoughts here..."
                  className="w-full px-4 py-3 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-ink-900 text-parchment-50 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

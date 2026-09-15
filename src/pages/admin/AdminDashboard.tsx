import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  MessageSquare,
  Users,
  Edit,
  Trash2,
  LogOut,
  Plus,
  Search,
  ExternalLink,
  Shield,
  Star,
} from 'lucide-react';
import { Post, AdminStats, Subscriber, ContactMessage } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'posts' | 'subscribers' | 'contacts'>('posts');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);


  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsData, postsData, subsData, contactsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminPosts(),
        api.getSubscribers(),
        api.getContactMessages(),
      ]);
      setStats(statsData);
      setPosts(postsData);
      setSubscribers(subsData);
      setContacts(contactsData);
    } catch (err: any) {
      showToast(err.message || 'Error loading dashboard', 'error');
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await api.updatePost(post.id, { status: newStatus });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      showToast(`Post marked as ${newStatus}!`, 'success');
      // refresh stats
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (err: any) {
      showToast(err.message || 'Failed to update post status', 'error');
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deletePost(deleteTargetId);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
      showToast('Post deleted successfully', 'success');
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete post', 'error');
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-parchment-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-amberGold-800 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Creator Sanctuary
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
            Author Studio — N. S. Aishwarya
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Logged in as {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/new"
            className="px-5 py-2.5 bg-ink-900 text-parchment-50 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Chapter</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="p-2.5 rounded-full border border-parchment-300 text-ink-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-ink-500 font-medium">Total Chapters</div>
            <div className="font-serif text-2xl font-bold text-ink-950 mt-1">{stats.totalPosts}</div>
          </div>
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-emerald-700 font-medium">Published</div>
            <div className="font-serif text-2xl font-bold text-emerald-800 mt-1">{stats.publishedPosts}</div>
          </div>
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-amber-700 font-medium">Drafts</div>
            <div className="font-serif text-2xl font-bold text-amber-800 mt-1">{stats.draftPosts}</div>
          </div>
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-amberGold-700 font-medium">Subscribers</div>
            <div className="font-serif text-2xl font-bold text-amberGold-800 mt-1">{stats.totalSubscribers}</div>
          </div>
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-ink-600 font-medium">Messages</div>
            <div className="font-serif text-2xl font-bold text-ink-950 mt-1">{stats.totalMessages}</div>
          </div>
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4">
            <div className="text-xs text-rosewood-700 font-medium">Comments</div>
            <div className="font-serif text-2xl font-bold text-rosewood-800 mt-1">{stats.totalComments}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-parchment-200">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'border-ink-900 text-ink-950'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapters ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'border-ink-900 text-ink-950'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 ${
            activeTab === 'contacts'
              ? 'border-ink-900 text-ink-950'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reader Letters ({contacts.length})</span>
        </button>
      </div>

      {/* TAB 1: POSTS */}
      {activeTab === 'posts' && (
        <div>
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title or theme..."
                className="w-full pl-10 pr-4 py-2 bg-[#FFFDF9] border border-parchment-300 rounded-xl text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
              />
            </div>
            <div className="flex gap-1.5">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    statusFilter === st
                      ? 'bg-ink-900 text-parchment-50'
                      : 'bg-parchment-100 text-ink-700 hover:bg-parchment-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 overflow-hidden shadow-xs">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center text-ink-500 text-sm">
                No writings found matching your filter.
              </div>
            ) : (
              <div className="divide-y divide-parchment-200">
                {filteredPosts.map((p) => (
                  <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-parchment-50/50 transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs mb-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {p.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-parchment-200 text-ink-700">
                          {p.category}
                        </span>
                        {Boolean(p.is_featured) && (
                          <span className="flex items-center gap-1 text-[11px] text-amberGold-800 font-medium">
                            <Star className="w-3 h-3 fill-amberGold-500 text-amberGold-500" />
                            Featured
                          </span>
                        )}
                        <span className="text-ink-400">•</span>
                        <span className="text-ink-400">{p.reading_time}</span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 truncate">
                        {p.title}
                      </h3>
                      <p className="text-xs text-ink-500 truncate mt-0.5">
                        /{p.slug} • {p.published_at}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to={`/writings/${p.slug}`}
                        target="_blank"
                        className="p-2 text-ink-500 hover:text-amberGold-800 transition"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          p.status === 'published'
                            ? 'text-amber-800 border-amber-300 hover:bg-amber-50'
                            : 'text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                        }`}
                        title="Toggle Draft/Published"
                      >
                        {p.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="p-2 rounded-lg border border-parchment-300 text-ink-700 hover:bg-parchment-100 hover:text-amberGold-800 transition"
                        title="Edit Chapter"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteTargetId(p.id)}
                        className="p-2 rounded-lg border border-parchment-300 text-ink-400 hover:text-rose-600 hover:border-rose-300 transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-parchment-200 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Reader Newsletter Subscribers ({subscribers.length})
            </h3>
            <span className="text-xs text-ink-500">
              Addresses registered via homepage & footer forms
            </span>
          </div>

          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-ink-500 text-sm">
              No subscribers yet. They will appear here once visitors sign up.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment-100 text-ink-600 border-b border-parchment-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-200">
                {subscribers.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-parchment-50/70">
                    <td className="py-3 px-4 text-ink-400">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-ink-900">{sub.email}</td>
                    <td className="py-3 px-4 text-ink-500">{sub.subscribed_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 3: CONTACT MESSAGES */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Reader Inquiries & Letters ({contacts.length})
            </h3>
            <span className="text-xs text-ink-500">
              Sent through the Contact Page
            </span>
          </div>

          {contacts.length === 0 ? (
            <div className="py-16 text-center text-ink-500 text-sm bg-[#FFFDF9] rounded-2xl border border-parchment-200">
              No letters in your inbox yet.
            </div>
          ) : (
            contacts.map((msg) => (
              <div key={msg.id} className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-parchment-200">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-ink-900">
                      {msg.name} <span className="text-xs font-normal text-ink-500">({msg.email})</span>
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-parchment-200 text-ink-700">
                      {msg.subject}
                    </span>
                  </div>
                  <span className="text-xs text-ink-400">
                    {msg.created_at}
                  </span>
                </div>
                <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
                <div className="mt-4 pt-3 border-t border-parchment-200 flex justify-end">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-xs font-semibold uppercase tracking-wider text-amberGold-800 hover:text-amberGold-950"
                  >
                    Reply via Email →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-300 p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl font-bold text-ink-950 mb-2">Delete Chapter?</h3>
            <p className="text-xs text-ink-600 mb-6">
              Are you sure you want to delete this writing? This will also remove any reader comments attached to it.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-parchment-300 text-xs font-medium text-ink-700 hover:bg-parchment-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

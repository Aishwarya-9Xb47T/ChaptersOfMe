import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Feather,
  Send,
} from 'lucide-react';
import { Post, Comment } from '../types';
import { api } from '../services/api';
import { useToast } from '../components/common/Toast';
import { PostCard } from '../components/common/PostCard';

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [navigation, setNavigation] = useState<{
    prev: { title: string; slug: string } | null;
    next: { title: string; slug: string } | null;
  }>({ prev: null, next: null });
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Comment form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        const data = await api.getPostBySlug(slug);
        setPost(data.post);
        setRelated(data.related || []);
        setNavigation(data.navigation || { prev: null, next: null });

        // Fetch comments
        const commentsData = await api.getComments(slug);
        setComments(commentsData);
      } catch (err: any) {
        console.error('Failed to load post', err);
        showToast(err.message || 'Post not found', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Chapter link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentName.trim() || !commentContent.trim()) {
      showToast('Please provide your name and thought.', 'error');
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await api.addComment({
        post_slug: slug,
        author_name: commentName.trim(),
        author_email: commentEmail.trim() || undefined,
        content: commentContent.trim(),
      });

      setComments((prev) => [newComment, ...prev]);
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
      showToast('Your reflection has been posted warmly. Thank you!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not post reflection', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Render article content formatted for poems and prose
  const renderFormattedContent = (content: string) => {
    const isPoem = post?.category.toLowerCase().includes('poetry');

    if (isPoem) {
      // Poetry mode: preserves stanza breaks, rhythm, and verse
      const stanzas = content.split('\n\n');
      return (
        <div className="poetry-content max-w-xl mx-auto my-8 space-y-6 text-center sm:text-left sm:pl-8 sm:border-l-2 sm:border-amberGold-300/80">
          {stanzas.map((stanza, idx) => {
            if (stanza.startsWith('>')) {
              const cleanQuote = stanza.replace(/^>\s*/gm, '').replace(/\*/g, '');
              return (
                <div key={idx} className="my-6 italic text-amberGold-800 text-lg bg-amberGold-50/60 p-4 rounded-xl border-l-2 border-amberGold-400">
                  {cleanQuote}
                </div>
              );
            }
            return (
              <p key={idx} className="whitespace-pre-line leading-loose text-ink-800 font-serif text-xl tracking-wide">
                {stanza}
              </p>
            );
          })}
        </div>
      );
    }

    // Prose mode: format Markdown-like headings, quotes, and paragraphs
    const paragraphs = content.split('\n\n');
    return (
      <div className="prose prose-stone max-w-none text-ink-800 text-lg leading-relaxed font-sans space-y-6">
        {paragraphs.map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-10 mb-4 pt-4 border-t border-parchment-200">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-serif text-3xl font-bold text-ink-950 mt-12 mb-4">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('>')) {
            const cleanQuote = trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '');
            return (
              <blockquote key={idx} className="editorial-quote">
                "{cleanQuote}"
              </blockquote>
            );
          }
          if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
            const items = trimmed.split('\n');
            return (
              <ul key={idx} className="space-y-2.5 my-4 pl-6 list-disc">
                {items.map((item, i) => (
                  <li key={i} className="text-ink-700 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/^(\d+\. |- )/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-ink-700 leading-relaxed text-base sm:text-lg">
              <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-6 w-32 bg-parchment-200 rounded-full mb-6" />
        <div className="h-12 w-3/4 bg-parchment-200 rounded-lg mb-6" />
        <div className="h-80 w-full bg-parchment-200 rounded-3xl mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-parchment-200 rounded w-full" />
          <div className="h-4 bg-parchment-200 rounded w-5/6" />
          <div className="h-4 bg-parchment-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Chapter Not Found</h2>
        <p className="text-ink-600 mb-8">The writing you are looking for might have moved or is still being penned.</p>
        <Link
          to="/writings"
          className="px-6 py-3 bg-ink-900 text-parchment-50 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition"
        >
          Return to All Writings
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back link */}
      <div className="mb-8">
        <Link
          to="/writings"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-amberGold-800 transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          <span>Back to All Writings</span>
        </Link>
      </div>

      {/* Header section */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-ink-500 mb-4">
          <span className="px-3 py-1 rounded-full font-semibold uppercase tracking-wider bg-amberGold-100 text-amberGold-900 border border-amberGold-300">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.reading_time}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-950 tracking-tight leading-[1.1] mb-6">
          {post.title}
        </h1>

        <p className="font-serif italic text-xl sm:text-2xl text-amberGold-900/90 leading-relaxed mb-6 border-l-2 border-amberGold-400 pl-4 py-1">
          {post.excerpt}
        </p>

        {/* Author & Share Bar */}
        <div className="flex items-center justify-between border-y border-parchment-200 py-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-parchment-200 overflow-hidden border border-amberGold-300">
              <img
                src="/Me.jpg"
                alt="N. S. Aishwarya"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-xs text-ink-400 uppercase tracking-widest block font-medium">
                Written by
              </span>
              <span className="text-sm font-semibold text-ink-900">
                N. S. Aishwarya
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-parchment-300 text-xs font-medium text-ink-700 hover:bg-parchment-100 hover:border-amberGold-400 transition"
              title="Copy Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900 text-parchment-50 text-xs font-medium hover:bg-amberGold-800 transition shadow-sm"
              title="Share Chapter"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.cover_image && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-sm border border-parchment-200 bg-parchment-200 aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-parchment-200/90 p-6 sm:p-12 shadow-sm mb-16">
        {renderFormattedContent(post.content)}

        {/* End of chapter signature */}
        <div className="mt-14 pt-8 border-t border-parchment-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-500 font-serif italic">
            <Feather className="w-4 h-4 text-amberGold-600" />
            <span>Penned in the personal journal of N. S. Aishwarya</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs text-amberGold-800 hover:text-amberGold-950 font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share this with someone you hold dear</span>
          </button>
        </div>
      </div>

      {/* Author Bio Box */}
      <div className="bg-[#FAF6F0] rounded-2xl border border-amberGold-300/60 p-6 sm:p-8 mb-16 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src="/Me.jpg"
          alt="N. S. Aishwarya"
          className="w-20 h-20 rounded-full object-cover object-top border-2 border-amberGold-400 shadow-sm flex-shrink-0"
        />
        <div>
          <span className="text-xs uppercase tracking-widest text-amberGold-800 font-semibold block mb-1">
            About N. S. Aishwarya
          </span>
          <p className="text-ink-700 text-sm leading-relaxed mb-3">
            I am a student, writer, and dreamer. I believe the most transformative things in life are those we feel most deeply but rarely say out loud. <em>Chapters of Me</em> is my ongoing dedication to honesty, poetry, and kindness.
          </p>
          <Link
            to="/about"
            className="text-xs font-semibold text-ink-900 hover:text-amberGold-800 underline underline-offset-4"
          >
            Read my full journey →
          </Link>
        </div>
      </div>

      {/* Next / Previous Navigation */}
      {(navigation.prev || navigation.next) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {navigation.prev ? (
            <Link
              to={`/writings/${navigation.prev.slug}`}
              className="p-5 rounded-2xl border border-parchment-200 bg-[#FFFDF9] hover:border-amberGold-400 hover:shadow-sm transition group flex flex-col justify-between"
            >
              <span className="text-xs text-ink-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
                Previous Chapter
              </span>
              <h4 className="font-serif text-lg font-bold text-ink-900 group-hover:text-amberGold-800 transition line-clamp-2">
                {navigation.prev.title}
              </h4>
            </Link>
          ) : <div />}

          {navigation.next && (
            <Link
              to={`/writings/${navigation.next.slug}`}
              className="p-5 rounded-2xl border border-parchment-200 bg-[#FFFDF9] hover:border-amberGold-400 hover:shadow-sm transition group flex flex-col justify-between text-right sm:col-start-2"
            >
              <span className="text-xs text-ink-400 uppercase tracking-wider flex items-center justify-end gap-1 mb-2">
                Next Chapter
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
              <h4 className="font-serif text-lg font-bold text-ink-900 group-hover:text-amberGold-800 transition line-clamp-2">
                {navigation.next.title}
              </h4>
            </Link>
          )}
        </div>
      )}

      {/* Related Writings */}
      {related.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-parchment-200">
            <h3 className="font-serif text-2xl font-bold text-ink-950">
              More in {post.category}
            </h3>
            <Link
              to={`/writings?category=${encodeURIComponent(post.category)}`}
              className="text-xs font-semibold uppercase tracking-wider text-amberGold-800 hover:underline"
            >
              Explore Theme
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((relPost) => (
              <PostCard key={relPost.id} post={relPost} layout="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Reader Responses & Comments Section */}
      <section className="pt-8 border-t border-parchment-300">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-amberGold-600" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950">
            Reader Reflections ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-6 sm:p-8 mb-10 shadow-sm">
          <h4 className="font-serif text-xl font-bold text-ink-900 mb-2">
            Leave a quiet response
          </h4>
          <p className="text-xs text-ink-500 mb-6">
            How did this chapter resonate with you? Share your reflections, thoughts, or kind words.
          </p>

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full px-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-1.5">
                  Email (Optional, not published)
                </label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-1.5">
                Your Thought or Reflection *
              </label>
              <textarea
                required
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full px-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingComment}
              className="px-6 py-3 bg-ink-900 text-parchment-50 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? 'Sending...' : 'Post Reflection'}</span>
            </button>
          </form>
        </div>

        {/* Existing Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-ink-400 text-sm italic font-serif">
            Be the first to leave a gentle response to this chapter.
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#FFFDF9] rounded-2xl border border-parchment-200/80 p-5 sm:p-6 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-ink-900 text-base sm:text-lg">
                    {comment.author_name}
                  </span>
                  <span className="text-xs text-ink-400">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
};

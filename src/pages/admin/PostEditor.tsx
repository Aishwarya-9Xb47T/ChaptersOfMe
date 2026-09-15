import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Quote,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Image,
  CheckCircle2,
} from 'lucide-react';
import { Post, Category } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Poetry');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readingTime, setReadingTime] = useState('3 min read');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 16));

  const [categories, setCategories] = useState<Category[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suggested curated cover images
  const presetImages = [
    { label: 'Warm Journal & Flowers', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Morning Sunlight & Window', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Student Study Desk', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Night Sky & Stars', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Vintage Typewriter', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop' },
  ];

  useEffect(() => {
    async function init() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);

        if (isEditing && id) {
          const allPosts = await api.getAdminPosts();
          const postToEdit = allPosts.find((p) => p.id === parseInt(id, 10));
          if (postToEdit) {
            setTitle(postToEdit.title);
            setSlug(postToEdit.slug);
            setCategory(postToEdit.category);
            setExcerpt(postToEdit.excerpt);
            setContent(postToEdit.content);
            setCoverImage(postToEdit.cover_image || '');
            setReadingTime(postToEdit.reading_time);
            setIsFeatured(Boolean(postToEdit.is_featured));
            setStatus(postToEdit.status);
            setPublishedAt(postToEdit.published_at ? postToEdit.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16));
          } else {
            showToast('Post not found', 'error');
            navigate('/admin');
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to initialize editor', 'error');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [id, isEditing]);

  // Auto calculate reading time based on content length
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const est = Math.max(1, Math.ceil(wordCount / 180));
    setReadingTime(`${est} min read`);
  }, [content]);

  // Auto generate slug if creating a new post and slug isn't customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Quick formatting toolbar insertion
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  const handleSave = async (forceStatus?: 'published' | 'draft') => {
    if (!title.trim() || !category || !excerpt.trim() || !content.trim()) {
      showToast('Please fill in the title, category, excerpt, and content.', 'error');
      return;
    }

    const finalStatus = forceStatus || status;

    try {
      setSaving(true);
      const payload: Partial<Post> = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
        category,
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image: coverImage.trim() || undefined,
        reading_time: readingTime,
        is_featured: isFeatured ? 1 : 0,
        status: finalStatus,
        published_at: publishedAt.replace('T', ' ') + ':00',
      };

      if (isEditing && id) {
        await api.updatePost(parseInt(id, 10), payload);
        showToast('Chapter updated successfully!', 'success');
      } else {
        await api.createPost(payload);
        showToast('New chapter published successfully!', 'success');
      }
      navigate('/admin');
    } catch (err: any) {
      showToast(err.message || 'Error saving chapter', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-ink-500 font-serif">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-parchment-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl border border-parchment-300 text-ink-600 hover:bg-parchment-100 transition"
            title="Return to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950">
              {isEditing ? 'Edit Chapter' : 'Write New Chapter'}
            </h1>
            <p className="text-xs text-ink-500 mt-0.5">
              {category.toLowerCase().includes('poetry') ? 'Poetry stanza formatting active' : 'Prose and story editor'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition flex items-center gap-1.5 ${
              previewMode
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-[#FFFDF9] text-ink-700 border-parchment-300 hover:bg-parchment-100'
            }`}
          >
            {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-parchment-100 text-ink-800 border border-parchment-300 hover:bg-parchment-200 transition disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-amberGold-600 text-white hover:bg-amberGold-700 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Chapter'}</span>
          </button>
        </div>
      </div>

      {previewMode ? (
        /* LIVE PREVIEW COMPONENT */
        <div className="bg-[#FFFDF9] rounded-3xl border border-parchment-300 p-8 sm:p-12 shadow-sm animate-in fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amberGold-100 text-amberGold-900 font-semibold border border-amberGold-300 uppercase tracking-wider">
                {category}
              </span>
              <span>{readingTime}</span>
              <span>•</span>
              <span>{publishedAt}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-950 mb-4 leading-tight">
              {title || 'Untitled Chapter'}
            </h1>

            {excerpt && (
              <p className="font-serif italic text-xl text-amberGold-900 mb-6 border-l-2 border-amberGold-400 pl-4 py-1">
                {excerpt}
              </p>
            )}

            {coverImage && (
              <div className="my-8 rounded-2xl overflow-hidden aspect-[16/9] bg-parchment-200">
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-8">
              {category.toLowerCase().includes('poetry') ? (
                <div className="poetry-content space-y-6 max-w-lg pl-6 border-l-2 border-amberGold-300">
                  {content.split('\n\n').map((stanza, i) => (
                    <p key={i} className="whitespace-pre-line text-ink-800 font-serif text-xl leading-loose">
                      {stanza}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-ink-800 text-base sm:text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
                  {content}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* EDIT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editing Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                Chapter Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. To My Amma, Whom My Heart Chose"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-parchment-300 rounded-2xl font-serif text-xl sm:text-2xl font-bold text-ink-950 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                Opening Excerpt / Subtitle *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A tender one or two-sentence summary to entice readers..."
                className="w-full px-4 py-2.5 bg-[#FFFDF9] border border-parchment-300 rounded-xl text-sm text-ink-800 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 resize-none font-serif italic"
              />
            </div>

            {/* Content & Toolbar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Article or Poetry Content *
                </label>
                <span className="text-[11px] text-ink-400">
                  Tip: Separate stanzas or paragraphs with a blank line
                </span>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-parchment-100 border border-parchment-300 rounded-t-xl overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '\n')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '\n')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> "', '"\n')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Pull Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ', '\n')}
                  className="p-1.5 rounded hover:bg-white text-ink-700"
                  title="Bullet Item"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                rows={16}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  category.toLowerCase().includes('poetry')
                    ? "Type your poem here.\nPreserve line breaks exactly as you want them to be read.\n\nLeave a blank line between stanzas..."
                    : "Write your reflection or story here...\n\nUse ### for section headings\nUse > for reflective quotes"
                }
                className="w-full px-5 py-4 bg-[#FFFDF9] border border-t-0 border-parchment-300 rounded-b-xl text-base text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 font-serif leading-relaxed"
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category & Status Box */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-5 space-y-4 shadow-xs">
              <h3 className="font-serif text-base font-bold text-ink-950 pb-2 border-b border-parchment-200">
                Publishing Details
              </h3>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Theme / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Publication Date */}
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Publication Date</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="custom-url-slug"
                  className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400 font-mono"
                />
              </div>

              {/* Featured checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-parchment-300 text-amberGold-600 focus:ring-amberGold-400"
                />
                <label htmlFor="featured-toggle" className="text-xs font-medium text-ink-800 cursor-pointer">
                  Feature on Homepage Hero
                </label>
              </div>
            </div>

            {/* Cover Image Picker */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-5 space-y-3 shadow-xs">
              <h3 className="font-serif text-base font-bold text-ink-950 pb-2 border-b border-parchment-200 flex items-center justify-between">
                <span>Cover Image</span>
                <Image className="w-4 h-4 text-ink-400" />
              </h3>

              <div>
                <label className="block text-[11px] text-ink-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
                />
              </div>

              {coverImage && (
                <div className="rounded-xl overflow-hidden aspect-[16/9] border border-parchment-300 bg-parchment-100">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Preset gallery */}
              <div className="pt-2">
                <span className="text-[11px] font-medium text-ink-500 block mb-2">
                  Or pick a curated aesthetic preset:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {presetImages.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition border flex items-center justify-between ${
                        coverImage === preset.url
                          ? 'bg-amberGold-50 border-amberGold-300 text-amberGold-900 font-semibold'
                          : 'bg-parchment-50 border-parchment-200 text-ink-700 hover:bg-parchment-100'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {coverImage === preset.url && <CheckCircle2 className="w-3.5 h-3.5 text-amberGold-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

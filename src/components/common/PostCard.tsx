import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Bookmark, ArrowUpRight } from 'lucide-react';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  layout?: 'grid' | 'featured' | 'list';
}

export const PostCard: React.FC<PostCardProps> = ({ post, layout = 'grid' }) => {
  const isPoem = post.category.toLowerCase().includes('poetry');

  // Badge styling depending on category
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'poetry':
        return 'bg-rosewood-100 text-rosewood-800 border-rosewood-200';
      case 'student life':
        return 'bg-sageMuted-100 text-sageMuted-700 border-sageMuted-200';
      case 'dreams':
        return 'bg-amberGold-100 text-amberGold-800 border-amberGold-300';
      case 'family':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'love & relationships':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-parchment-200 text-ink-700 border-parchment-300';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Featured Layout
  if (layout === 'featured') {
    return (
      <article className="group relative bg-[#FFFDF9] rounded-2xl border border-parchment-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {post.cover_image && (
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-parchment-200">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-parchment-50/95 text-amberGold-900 border border-amberGold-300 backdrop-blur-sm shadow-sm">
                  <Bookmark className="w-3 h-3 text-amberGold-600 fill-amberGold-600" />
                  Featured Chapter
                </span>
              </div>
            </div>
          )}

          <div className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${post.cover_image ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            <div>
              <div className="flex items-center gap-3 text-xs text-ink-500 mb-4 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full font-medium border text-xs ${getCategoryColor(post.category)}`}>
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

              <Link to={`/writings/${post.slug}`}>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-950 group-hover:text-amberGold-800 transition duration-200 leading-tight mb-4">
                  {post.title}
                </h3>
              </Link>

              <p className="text-ink-600 text-base leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-parchment-200/80 flex items-center justify-between">
              <span className="text-xs text-ink-500 font-serif italic">
                By N. S. Aishwarya
              </span>
              <Link
                to={`/writings/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-900 group-hover:text-amberGold-700 transition"
              >
                <span>{isPoem ? 'Read Poem' : 'Read Chapter'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // List Layout
  if (layout === 'list') {
    return (
      <article className="group bg-[#FFFDF9] rounded-xl border border-parchment-200/80 p-5 hover:border-amberGold-300 transition-all duration-200 shadow-sm hover:shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs text-ink-500 mb-2">
              <span className={`px-2 py-0.5 rounded-full font-medium border text-[11px] ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span>{formatDate(post.published_at)}</span>
              <span>•</span>
              <span>{post.reading_time}</span>
            </div>

            <Link to={`/writings/${post.slug}`}>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 group-hover:text-amberGold-800 transition duration-200">
                {post.title}
              </h3>
            </Link>

            <p className="text-ink-600 text-sm mt-1 line-clamp-2">
              {post.excerpt}
            </p>
          </div>

          <Link
            to={`/writings/${post.slug}`}
            className="self-start sm:self-center px-4 py-2 rounded-full border border-parchment-300 text-xs font-semibold text-ink-800 hover:bg-amberGold-100 hover:text-amberGold-900 transition flex items-center gap-1 whitespace-nowrap"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    );
  }

  // Standard Grid Layout
  return (
    <article className="group flex flex-col bg-[#FFFDF9] rounded-2xl border border-parchment-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-amberGold-300 transition-all duration-300">
      {post.cover_image && (
        <Link to={`/writings/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-parchment-200">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm bg-white/90 ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
        </Link>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {!post.cover_image && (
            <div className="mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-ink-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.published_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time}
            </span>
          </div>

          <Link to={`/writings/${post.slug}`}>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 group-hover:text-amberGold-800 transition duration-200 leading-snug mb-3">
              {post.title}
            </h3>
          </Link>

          <p className="text-ink-600 text-sm leading-relaxed line-clamp-3 mb-6">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-parchment-200/80 flex items-center justify-between mt-auto">
          <span className="text-xs text-ink-400 font-serif italic">
            By N. S. Aishwarya
          </span>
          <Link
            to={`/writings/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-ink-900 group-hover:text-amberGold-700 transition"
          >
            <span>{isPoem ? 'Read Poem' : 'Read Chapter'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>
      </div>
    </article>
  );
};

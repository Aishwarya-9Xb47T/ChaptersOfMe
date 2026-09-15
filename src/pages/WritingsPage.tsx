import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List, Sparkles, X } from 'lucide-react';
import { Post, Category } from '../types';
import { api } from '../services/api';
import { PostCard } from '../components/common/PostCard';

export const WritingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Update selectedCategory if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch posts whenever filters change
  useEffect(() => {
    async function fetchFilteredPosts() {
      try {
        setLoading(true);
        const data = await api.getPosts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() !== '' ? searchQuery : undefined,
          sort: sortBy,
        });
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFilteredPosts();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
          The Full Archive
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-950 tracking-tight mb-4">
          All Writings & Musings
        </h1>
        <p className="text-ink-600 text-base sm:text-lg leading-relaxed">
          Explore the complete anthology of poems, personal letters, student memories, and essays penned by N. S. Aishwarya.
        </p>
      </div>

      {/* Search and Controls Bar */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-parchment-200 p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, poem line, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amberGold-400 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort and View Toggle */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amberGold-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort writings"
                className="bg-parchment-50 border border-parchment-300 rounded-lg px-3 py-2 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-amberGold-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-parchment-100 p-1 rounded-lg border border-parchment-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-ink-950 shadow-xs' : 'text-ink-500 hover:text-ink-800'}`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-ink-950 shadow-xs' : 'text-ink-500 hover:text-ink-800'}`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="mt-5 pt-5 border-t border-parchment-200/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-ink-900 text-parchment-50 shadow-sm'
                : 'bg-parchment-100 text-ink-700 hover:bg-parchment-200 border border-parchment-300'
            }`}
          >
            All Themes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-ink-900 text-parchment-50 shadow-sm'
                  : 'bg-parchment-100 text-ink-700 hover:bg-parchment-200 border border-parchment-300'
              }`}
            >
              <span>{cat.name}</span>
              {cat.post_count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-white/20 text-white'
                      : 'bg-parchment-200 text-ink-500'
                  }`}
                >
                  {cat.post_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-parchment-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-parchment-200 p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-parchment-100 border border-parchment-300 flex items-center justify-center text-ink-400 mx-auto mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">No chapters found</h3>
          <p className="text-sm text-ink-600 mb-6">
            We couldn't find any writings matching your search or selected theme.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-amberGold-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};

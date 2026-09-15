import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, ArrowRight, Sparkles, Heart, Coffee, GraduationCap, Flame } from 'lucide-react';
import { Post, Category } from '../types';
import { api } from '../services/api';
import { PostCard } from '../components/common/PostCard';
import { NewsletterSection } from '../components/common/NewsletterSection';

export const HomePage: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsData, catsData] = await Promise.all([
          api.getPosts(),
          api.getCategories(),
        ]);

        const featured = postsData.filter((p) => p.is_featured === 1 || p.is_featured === true);
        setFeaturedPosts(featured.length > 0 ? featured.slice(0, 2) : postsData.slice(0, 1));
        setLatestPosts(postsData.slice(0, 4));

        const priorityOrder = ['poetry', 'dreams', 'student life', 'life & lessons', 'family', 'personal growth'];
        const sortedCats = [...catsData].sort((a, b) => {
          const indexA = priorityOrder.indexOf(a.name.toLowerCase());
          const indexB = priorityOrder.indexOf(b.name.toLowerCase());
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return (b.post_count || 0) - (a.post_count || 0);
        });
        setCategories(sortedCats);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Icon mapping for categories
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('poetry')) return <Feather className="w-5 h-5 text-rosewood-600" />;
    if (n.includes('student')) return <GraduationCap className="w-5 h-5 text-sageMuted-600" />;
    if (n.includes('dreams')) return <Sparkles className="w-5 h-5 text-amberGold-600" />;
    if (n.includes('family')) return <Heart className="w-5 h-5 text-amber-700" />;
    if (n.includes('love')) return <Heart className="w-5 h-5 text-rose-500" />;
    if (n.includes('life')) return <Coffee className="w-5 h-5 text-stone-700" />;
    return <Flame className="w-5 h-5 text-amberGold-700" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-3xl mx-auto pt-6 pb-16 sm:pb-24">
        {/* Subtle decorative crest */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-parchment-100 border border-amberGold-300/80 text-amberGold-900 text-xs font-medium tracking-widest uppercase mb-8 shadow-sm animate-in fade-in duration-500">
          <Sparkles className="w-3.5 h-3.5 text-amberGold-600" />
          <span>A Personal Literary Sanctuary</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-ink-950 leading-[1.05] mb-6">
          Chapters <span className="font-serif italic font-normal text-amberGold-700">of</span> Me
        </h1>

        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-ink-700 max-w-2xl mx-auto leading-relaxed mb-8">
          "Poems, thoughts, stories, and everything in between."
        </p>

        <p className="text-ink-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Welcome to the personal journal of <strong>N. S. Aishwarya</strong>. Here, raw emotions meet intentional stillness—reflecting on student life, quiet family sacrifices, deep poetry, and dreams that keep us awake.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/writings"
            className="w-full sm:w-auto px-8 py-4 bg-ink-900 text-parchment-50 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Read My Writings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-4 bg-[#FFFDF9] border border-parchment-300 text-ink-800 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-parchment-100 hover:border-amberGold-400 transition duration-300 flex items-center justify-center gap-2"
          >
            <span>About the Writer</span>
          </Link>
        </div>

        {/* Delicate divider ornament */}
        <div className="mt-16 flex items-center justify-center gap-3 text-amberGold-400">
          <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amberGold-300" />
          <Feather className="w-4 h-4 text-amberGold-600" />
          <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amberGold-300" />
        </div>
      </section>

      {/* 2. WELCOMING WRITER'S INTRODUCTION NOTE */}
      <section className="my-12">
        <div className="bg-[#FFFDF9] rounded-3xl border border-parchment-200/90 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Writer image / silhouette */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-amberGold-300 via-parchment-200 to-rosewood-300 shadow-md">
                <img
                  src="/Me.jpg"
                  alt="N. S. Aishwarya"
                  className="w-full h-full object-cover object-top rounded-full border-2 border-white"
                />
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-amberGold-600 text-parchment-50 flex items-center justify-center shadow-lg border-2 border-white">
                  <Feather className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Introductory Text */}
            <div className="md:col-span-8">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
                A Note From The Author
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mb-4">
                "We do not write to escape life, but to prevent life from escaping us."
              </h2>
              <p className="text-ink-600 text-base sm:text-lg leading-relaxed mb-4">
                Hi, I am <strong>N. S. Aishwarya</strong>. <em>Chapters of Me</em> is my open heart rendered in prose and poetry. Whether you are navigating the overwhelming halls of student life, wrestling with unspoken longing, or simply seeking a gentle corner of the internet to pause, I hope these pages remind you that you are not alone in what you feel.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-parchment-200/80">
                <span className="font-serif italic text-xl text-ink-800">
                  — N. S. Aishwarya
                </span>
                <Link
                  to="/about"
                  className="text-xs font-semibold uppercase tracking-wider text-amberGold-800 hover:text-amberGold-950 flex items-center gap-1 group"
                >
                  <span>My Story & Journey</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED WRITINGS */}
      {featuredPosts.length > 0 && (
        <section className="my-20">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-parchment-200">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-1">
                Handpicked Stories
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
                Featured Chapters
              </h2>
            </div>
            <Link
              to="/writings"
              className="text-xs font-semibold uppercase tracking-wider text-ink-700 hover:text-amberGold-800 hidden sm:flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-8">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} layout="featured" />
            ))}
          </div>
        </section>
      )}

      {/* 4. EXPLORE BY CATEGORY */}
      <section className="my-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-2">
            Themes & Echoes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mb-3">
            Explore by Chapter
          </h2>
          <p className="text-sm text-ink-600">
            Every feeling has a home. Select a theme to browse corresponding poems, reflections, and essays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/writings?category=${encodeURIComponent(cat.name)}`}
              className="group bg-[#FFFDF9] rounded-2xl border border-parchment-200/90 p-6 hover:border-amberGold-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[148px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-parchment-100 border border-parchment-200 flex items-center justify-center group-hover:scale-110 group-hover:border-amberGold-300 transition duration-300 shadow-2xs">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-parchment-100 text-ink-600 border border-parchment-200">
                  {cat.post_count || 0} {cat.post_count === 1 ? 'chapter' : 'chapters'}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-amberGold-800 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-ink-500 line-clamp-1 mt-1">
                  {cat.description || 'Browse chapters'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. LATEST WRITINGS */}
      <section className="my-20">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-parchment-200">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amberGold-800 block mb-1">
              Fresh Ink
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
              Latest Writings
            </h2>
          </div>
          <Link
            to="/writings"
            className="text-xs font-semibold uppercase tracking-wider text-ink-700 hover:text-amberGold-800 flex items-center gap-1 group"
          >
            <span>Browse Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-parchment-200/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} layout="grid" />
            ))}
          </div>
        )}
      </section>

      {/* 6. NEWSLETTER SUBSCRIPTION */}
      <NewsletterSection />
    </div>
  );
};

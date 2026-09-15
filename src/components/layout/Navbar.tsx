import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Feather, Menu, X, PenLine, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Writings', path: '/writings' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-parchment-200/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-parchment-100 border border-amberGold-400/60 flex items-center justify-center text-amberGold-700 shadow-sm group-hover:scale-105 transition duration-300">
              <Feather className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-ink-950 group-hover:text-amberGold-800 transition duration-300 block leading-tight">
                Chapters of Me
              </span>
              <span className="font-serif italic text-xs tracking-wider text-amberGold-900/85 block font-normal -mt-0.5">
                by N. S. Aishwarya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-wide transition-all duration-200 relative py-1 ${
                  isActive(link.path)
                    ? 'text-amberGold-800 font-semibold'
                    : 'text-ink-700 hover:text-ink-950 font-medium'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amberGold-500 rounded-full animate-in fade-in duration-300" />
                )}
              </Link>
            ))}

            <div className="h-4 w-[1px] bg-parchment-300" />

            {/* Admin or Write link */}
            {user ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amberGold-100 text-amberGold-900 border border-amberGold-300 hover:bg-amberGold-200 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amberGold-700" />
                <span>Admin Studio</span>
              </Link>
            ) : (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-amberGold-800 transition py-1"
                title="Author Portal"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Author Portal</span>
              </Link>
            )}

            <Link
              to="/writings"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-ink-900 text-parchment-50 rounded-full hover:bg-amberGold-700 transition duration-300 shadow-sm hover:shadow"
            >
              Read Writings
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 text-ink-600 hover:text-amberGold-800"
              title="Admin"
            >
              <PenLine className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-ink-700 hover:bg-parchment-200 transition"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-parchment-200 bg-[#FAF6F0] px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-amberGold-100 text-amberGold-900 font-semibold'
                    : 'text-ink-800 hover:bg-parchment-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-parchment-200 my-2 pt-2 flex flex-col gap-2">
              <Link
                to="/writings"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider bg-ink-900 text-parchment-50 rounded-lg hover:bg-ink-800"
              >
                Explore All Chapters
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-xs font-medium text-ink-600 hover:text-amberGold-800"
              >
                Author & Admin Studio
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

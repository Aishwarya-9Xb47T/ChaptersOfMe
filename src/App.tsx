import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { WritingsPage } from './pages/WritingsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PostEditor } from './pages/admin/PostEditor';
import { useAuth } from './context/AuthContext';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Wrapper for Admin Studio
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-ink-600 font-serif">
        Validating author credentials...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-ink-900 selection:bg-amberGold-200 selection:text-ink-950 font-sans">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/writings" element={<WritingsPage />} />
          <Route path="/writings/:slug" element={<PostDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin / Studio Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/new"
            element={
              <ProtectedAdminRoute>
                <PostEditor />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedAdminRoute>
                <PostEditor />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route
            path="*"
            element={
              <div className="max-w-md mx-auto py-24 text-center px-4">
                <h2 className="font-serif text-4xl font-bold text-ink-950 mb-3">
                  404 — Chapter Not Found
                </h2>
                <p className="text-ink-600 text-sm mb-6">
                  The page you are looking for has not been written yet or has slipped between the margins.
                </p>
                <a
                  href="/"
                  className="px-6 py-3 bg-ink-900 text-parchment-50 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amberGold-800 transition"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

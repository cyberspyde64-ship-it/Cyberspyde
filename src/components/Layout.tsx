import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import AuthModal from './AuthModal';
import {
  Menu,
  X,
  Shield,
  Home,
  Info,
  Phone,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-cyan-400 font-semibold'
      : 'text-gray-300 hover:text-cyan-400';

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About', icon: Info },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/internships', label: 'Internships', icon: Briefcase },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  const dashboardLink = profile?.role === 'admin'
    ? { to: '/admin', label: 'Admin Panel', icon: Shield }
    : { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Cyber<span className="text-cyan-400">Spyde</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(to)}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {user && (
                <Link
                  to={dashboardLink.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(dashboardLink.to)}`}
                >
                  <dashboardLink.icon className="w-4 h-4" />
                  {dashboardLink.label}
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    {profile?.full_name || user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors shadow-sm shadow-cyan-600/20"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(to)}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {user && (
                <Link
                  to={dashboardLink.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(dashboardLink.to)}`}
                >
                  <dashboardLink.icon className="w-4 h-4" />
                  {dashboardLink.label}
                </Link>
              )}
              <div className="pt-2 border-t border-gray-800">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 w-full rounded-lg hover:bg-red-400/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setAuthModalOpen(true); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg w-full justify-center"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-cyan-600/20">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Cyber<span className="text-cyan-400">Spyde</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Empowering learners with cutting-edge cybersecurity and technology courses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Courses</Link></li>
                <li><Link to="/internships" className="hover:text-cyan-400 transition-colors">Internships</Link></li>
                <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                <li><a href="mailto:cyberspyde64@gmail.com" className="hover:text-cyan-400 transition-colors">Email Us</a></li>
                <li><a href="tel:+919003822475" className="hover:text-cyan-400 transition-colors">Call Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:cyberspyde64@gmail.com" className="hover:text-cyan-400 transition-colors">cyberspyde64@gmail.com</a></li>
                <li><a href="tel:+919003822475" className="hover:text-cyan-400 transition-colors">+91 9003822475</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Cyber Spyde. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919003822475?text=Hello%20Cyber%20Spyde!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.198-1.04.994-1.04 2.422 0 1.428 1.04 2.8 1.186 2.992.149.198 2.039 3.118 4.944 4.366.69.298 1.228.476 1.647.606.692.22 1.324.189 1.824.114.556-.083 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.864 9.864 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

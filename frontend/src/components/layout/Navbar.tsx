import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-neutral-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>
            
            {isAuthenticated && !isLandingPage && !isAuthPage && (
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <NavLink 
                  to="/dashboard"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/jobs"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Job Posts
                </NavLink>
                {user?.role === 'veteran' && (
                <NavLink 
                  to="/veteran/applications"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  My Applications
                </NavLink>
                )}
                {user?.role === 'employer' && (
                <NavLink 
                  to="/candidates"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Candidates
                </NavLink>
                )}
                <NavLink 
                  to="/saved"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  {user?.role === 'employer' ? 'Saved Candidates' : 'Saved Jobs'}
                </NavLink>
                {user?.role === 'admin' && (
                <NavLink 
                  to="/admin"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Admin
                </NavLink>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-neutral-dark font-medium hover:text-primary transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button className="p-2 text-neutral-gray hover:text-primary transition-colors">
                  <Bell className="w-6 h-6" />
                </button>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-light p-2 rounded-lg transition-colors" 
                  onClick={() => navigate(user?.role === 'employer' ? '/company-profile' : '/profile')}
                >
                  <div className="w-8 h-8 bg-neutral-light rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-gray" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-neutral-dark">{user?.firstName || 'User'}</p>
                    <p className="text-xs text-neutral-gray capitalize">{user?.role || 'Member'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-gray" />
                </div>
                <button 
                  onClick={logout}
                  className="text-sm text-neutral-gray hover:text-red-500 transition-colors ml-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-gray hover:text-primary hover:bg-neutral-light focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-light absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {!isLandingPage ? (
              <>
                <NavLink 
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => 
                    `block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                      isActive 
                        ? 'border-primary text-primary bg-primary/5' 
                        : 'border-transparent text-neutral-gray hover:bg-neutral-light hover:border-neutral-gray'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/jobs"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => 
                    `block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                      isActive 
                        ? 'border-primary text-primary bg-primary/5' 
                        : 'border-transparent text-neutral-gray hover:bg-neutral-light hover:border-neutral-gray'
                    }`
                  }
                >
                  Job Posts
                </NavLink>
                {user?.role === 'employer' && (
                  <NavLink 
                    to="/candidates"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => 
                      `block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                        isActive 
                          ? 'border-primary text-primary bg-primary/5' 
                          : 'border-transparent text-neutral-gray hover:bg-neutral-light hover:border-neutral-gray'
                      }`
                    }
                  >
                    Candidates
                  </NavLink>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3 py-4">
                <button 
                  onClick={() => { navigate('/login'); closeMobileMenu(); }}
                  className="w-full text-center py-3 text-neutral-dark font-medium hover:bg-neutral-light rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => { navigate('/signup'); closeMobileMenu(); }}
                  className="w-full text-center py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

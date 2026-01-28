import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, LogIn } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="bg-white border-b border-neutral-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold text-primary flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-xs">Hi-Ed</div>
                Boots2Suits
              </span>
            </div>
            
            {!isLandingPage && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink 
                  to="/dashboard"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
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
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Job Posts
                </NavLink>
                <NavLink 
                  to="/candidates"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Candidates
                </NavLink>
                <NavLink 
                  to="/saved"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Saved Candidates
                </NavLink>
                <NavLink 
                  to="/profile"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-neutral-gray hover:border-neutral-light hover:text-neutral-dark'
                    }`
                  }
                >
                  Company Profile
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLandingPage ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-neutral-dark font-medium hover:text-primary transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <>
                <button className="p-2 text-neutral-gray hover:text-neutral-dark relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-neutral-light flex items-center justify-center overflow-hidden">
                     <User className="w-5 h-5 text-neutral-gray" />
                  </div>
                  <span className="text-sm font-medium text-neutral-dark hidden md:block">John Smith</span>
                  <ChevronDown className="w-4 h-4 text-neutral-gray" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

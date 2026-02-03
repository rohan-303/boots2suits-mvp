import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Shield className="w-8 h-8 text-secondary" />
              <span className="text-xl font-bold font-display">Boots2Suits</span>
            </Link>
            <p className="text-neutral-gray text-sm leading-relaxed mb-6">
              Empowering military veterans to translate their service into success in the corporate world through AI-driven tools and strategic partnerships.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-gray hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-neutral-gray hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-neutral-gray hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-neutral-gray">
              <li><Link to="/resume-builder" className="hover:text-secondary transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/jobs" className="hover:text-secondary transition-colors">Job Board</Link></li>
              <li><Link to="/resources" className="hover:text-secondary transition-colors">Resources</Link></li>
              <li><Link to="/login" className="hover:text-secondary transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display text-white">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-gray">
              <li><Link to="/partners" className="hover:text-secondary transition-colors">For Partners</Link></li>
              <li><Link to="#" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/stories" className="hover:text-secondary transition-colors">Success Stories</Link></li>
              <li><Link to="#" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter (Optional) */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display text-white">Stay Updated</h4>
            <p className="text-sm text-neutral-gray mb-4">
              Get the latest career tips and platform updates.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="bg-secondary hover:bg-secondary/90 text-primary-dark font-bold py-3 rounded-lg text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-gray text-sm">
            © {new Date().getFullYear()} Boots2Suits. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-gray">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

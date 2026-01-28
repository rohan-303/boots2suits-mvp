import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, UserCheck, Shield, Award } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary rounded-3xl overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/80 z-10"></div>
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579911098666-8b4ad0049079?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
        ></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Unlocking Untapped Potential: <br/>
            <span className="text-accent">Veterans & High-Impact Civilian Careers</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            A powerful match. We bridge the gap between military service and quality civilian employment, translating skills into success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/candidates')}
              className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
            >
              I'm an Employer
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
            >
              I'm a Veteran
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-light text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-3">Skill Translation</h3>
          <p className="text-neutral-gray">
            Our AI-powered engine automatically maps military MOS codes to civilian job requirements, highlighting your true value.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-light text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-3">Vetted Talent</h3>
          <p className="text-neutral-gray">
            Employers get access to pre-screened candidates with verified service records and security clearances.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-light text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-3">Secure Matching</h3>
          <p className="text-neutral-gray">
            Privacy-first platform that connects the right candidates with veteran-friendly organizations.
          </p>
        </div>
      </section>

      {/* Call to Action Segments */}
      <section className="grid md:grid-cols-2 gap-8 px-4">
        {/* For Veterans */}
        <div className="bg-neutral-dark rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => navigate('/jobs')}>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
          </div>
          <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[300px] bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-3xl font-bold text-white mb-2">For Veterans</h3>
            <p className="text-gray-300 mb-6">Find a career that values your service. Get matched today.</p>
            <span className="text-accent font-bold flex items-center gap-2">
              Find Jobs <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* For Employers */}
        <div className="bg-primary rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => navigate('/candidates')}>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
          </div>
          <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[300px] bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-3xl font-bold text-white mb-2">For Employers</h3>
            <p className="text-gray-300 mb-6">Build a resilient team with proven leaders. Hire veterans.</p>
            <span className="text-accent font-bold flex items-center gap-2">
              Find Talent <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

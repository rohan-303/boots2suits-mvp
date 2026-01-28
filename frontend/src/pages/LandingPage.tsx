import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, UserCheck, Shield, Award, FileText, Cpu, Handshake, Star, Quote } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative bg-primary rounded-3xl overflow-hidden text-white mx-4 mt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 to-primary/80 z-10"></div>
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579911098666-8b4ad0049079?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
        ></div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-8 py-32 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 border border-accent/30 rounded-full bg-accent/10 backdrop-blur-sm">
            <span className="text-accent font-bold tracking-wide text-sm uppercase">The Official Veteran-to-Executive Pipeline</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-display tracking-tight">
            YOUR SERVICE <span className="text-accent">DEFINED YOU.</span><br/>
            NOW LET IT <span className="text-white">PROPEL YOU.</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Boots2Suits doesn't just list jobs. We translate your military discipline into corporate leadership, matching you with employers who value mission-critical skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button 
              onClick={() => navigate('/candidates')}
              className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            >
              Hire Veterans
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Find a Job
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-neutral-light py-12 border-y border-neutral-gray/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-dark mb-1 font-display">12,000+</div>
            <div className="text-sm text-neutral-gray uppercase tracking-wider font-semibold">Veterans Placed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-dark mb-1 font-display">500+</div>
            <div className="text-sm text-neutral-gray uppercase tracking-wider font-semibold">Partner Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-dark mb-1 font-display">$85k</div>
            <div className="text-sm text-neutral-gray uppercase tracking-wider font-semibold">Avg. Starting Salary</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-dark mb-1 font-display">98%</div>
            <div className="text-sm text-neutral-gray uppercase tracking-wider font-semibold">Retention Rate</div>
          </div>
        </div>
      </section>

      {/* How It Works (The "Deep Research" Process Part) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 font-display">From Battlefield to Boardroom</h2>
          <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
            Our proprietary MOS Translator™ goes beyond keywords. We map your tactical experience to strategic corporate value.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 z-0 transform -translate-y-1/2"></div>

          {/* Step 1 */}
          <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-md">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-3">1. Upload Service Record</h3>
            <p className="text-neutral-gray">
              Upload your DD214 or resume. Our system identifies your rank, MOS, and deployments to build a comprehensive profile.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="w-20 h-20 bg-accent text-primary-dark rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-md">
              <Cpu className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-3">2. AI Skill Translation</h3>
            <p className="text-neutral-gray">
              We translate "Platoon Sergeant" to "Operations Manager." We highlight leadership, logistics, and crisis management skills employers crave.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="w-20 h-20 bg-primary-dark text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-md">
              <Handshake className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-3">3. Direct Placement</h3>
            <p className="text-neutral-gray">
              Skip the applicant tracking abyss. Get matched directly with hiring managers who are specifically looking for veteran talent.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-neutral-light py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 font-display">Success Stories</h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
              Real veterans. Real careers. See how Boots2Suits is changing lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-primary-dark italic mb-6 text-lg relative z-10">
                <Quote className="w-8 h-8 text-gray-100 absolute -top-2 -left-2 -z-10" />
                "I applied to 50 jobs with my standard resume and heard nothing. Boots2Suits translated my artillery experience into 'Supply Chain Logistics' and I was hired in 2 weeks."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80")' }}></div>
                <div>
                  <div className="font-bold text-primary-dark">Marcus T.</div>
                  <div className="text-sm text-neutral-gray">Former E-6, US Marine Corps</div>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-primary-dark italic mb-6 text-lg relative z-10">
                <Quote className="w-8 h-8 text-gray-100 absolute -top-2 -left-2 -z-10" />
                "As a tech company, we needed discipline and adaptability. The candidates we found here were head and shoulders above the general pool. We've hired 5 veterans this year."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80")' }}></div>
                <div>
                  <div className="font-bold text-primary-dark">Sarah Jenkins</div>
                  <div className="text-sm text-neutral-gray">HR Director, TechFlow Inc.</div>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-primary-dark italic mb-6 text-lg relative z-10">
                <Quote className="w-8 h-8 text-gray-100 absolute -top-2 -left-2 -z-10" />
                "Transitioning was scary. I didn't know how to explain what I did. This platform gave me the words and the confidence to walk into an interview and own the room."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80")' }}></div>
                <div>
                  <div className="font-bold text-primary-dark">Elena R.</div>
                  <div className="text-sm text-neutral-gray">Former O-3, US Air Force</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition (Refined) */}
      <section className="grid md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
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
      <section className="grid md:grid-cols-2 gap-8 px-4 max-w-7xl mx-auto">
        {/* For Veterans */}
        <div className="bg-neutral-dark rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl" onClick={() => navigate('/jobs')}>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
          </div>
          <div className="relative z-10 p-12 h-full flex flex-col justify-end min-h-[350px] bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <h3 className="text-4xl font-bold text-white mb-2 font-display">For Veterans</h3>
            <p className="text-gray-300 mb-8 text-lg">Ready to start your next chapter? Find a career that values your service.</p>
            <span className="text-accent font-bold flex items-center gap-2 text-xl">
              Find Jobs <ArrowRight className="w-6 h-6" />
            </span>
          </div>
        </div>

        {/* For Employers */}
        <div className="bg-primary rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl" onClick={() => navigate('/candidates')}>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
          </div>
          <div className="relative z-10 p-12 h-full flex flex-col justify-end min-h-[350px] bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <h3 className="text-4xl font-bold text-white mb-2 font-display">For Employers</h3>
            <p className="text-gray-300 mb-8 text-lg">Build a resilient team with proven leaders. Access the top 1% of veteran talent.</p>
            <span className="text-accent font-bold flex items-center gap-2 text-xl">
              Find Talent <ArrowRight className="w-6 h-6" />
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-dark text-white py-16 px-4 text-center rounded-3xl mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">Ready to bridge the gap?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of veterans and hundreds of companies building the future together.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-12 rounded-full text-xl transition-all shadow-lg shadow-accent/20"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
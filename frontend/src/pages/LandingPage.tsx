import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck, Shield, Award, FileText, Cpu, Handshake, Star, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { storyService, type Story } from '../services/storyService';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await storyService.getStories();
        setStories(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load stories', err);
      }
    };
    loadStories();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section - Main Entry Point */}
      <section className="relative bg-primary rounded-3xl overflow-hidden text-white mx-4 mt-4">
        <div className="absolute inset-0 bg-linear-to-r from-primary-dark/95 to-primary/80 z-10"></div>
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
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

      {/* Trusted By Section */}
      <section className="py-10 border-b border-neutral-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-neutral-gray uppercase tracking-widest mb-8">Trusted by Industry Leaders & Government Partners</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder Logos using Text/Icons for MVP */}
             <div className="flex items-center gap-2 text-xl font-bold text-primary-dark"><Shield className="w-6 h-6" /> DEFENSE CORP</div>
             <div className="flex items-center gap-2 text-xl font-bold text-primary-dark"><Cpu className="w-6 h-6" /> TECHVETS</div>
             <div className="flex items-center gap-2 text-xl font-bold text-primary-dark"><Award className="w-6 h-6" /> ELITE HIRE</div>
             <div className="flex items-center gap-2 text-xl font-bold text-primary-dark"><UserCheck className="w-6 h-6" /> VET TALENT</div>
             <div className="flex items-center gap-2 text-xl font-bold text-primary-dark"><FileText className="w-6 h-6" /> GOV SYSTEMS</div>
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
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto mb-8">
              Real veterans. Real careers. See how Boots2Suits is changing lives.
            </p>
            <button
              onClick={() => navigate('/stories')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              View All Stories <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stories.length > 0 ? (
              stories.map((story) => (
                <div key={story._id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 text-accent mb-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-primary-dark italic mb-6 text-base relative z-10 line-clamp-4">
                    <Quote className="w-8 h-8 text-gray-100 absolute -top-2 -left-2 -z-10" />
                    "{story.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {story.user.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-primary-dark">{story.user.firstName} {story.user.lastName}</div>
                      <div className="text-sm text-neutral-gray">{story.militaryBranch} to {story.currentRole}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback Static Stories if no API data
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* Dual Value Proposition */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Veterans */}
          <div className="bg-primary text-white p-10 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider mb-6">FOR VETERANS</div>
              <h3 className="text-3xl font-bold mb-4 font-display">Launch Your Second Career</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/20 p-1 rounded">
                    <UserCheck className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-gray-200">AI-powered resume translation that speaks corporate.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/20 p-1 rounded">
                    <UserCheck className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-gray-200">Access to hidden job markets and veteran-preferred roles.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/20 p-1 rounded">
                    <UserCheck className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-gray-200">Mentorship from veterans who have successfully transitioned.</p>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="w-full bg-white text-primary-dark font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join as Veteran
              </button>
            </div>
          </div>

          {/* For Employers */}
          <div className="bg-white border border-gray-200 p-10 rounded-3xl relative overflow-hidden group hover:border-accent transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-neutral-light text-primary-dark rounded-full text-xs font-bold tracking-wider mb-6">FOR EMPLOYERS</div>
              <h3 className="text-3xl font-bold text-primary-dark mb-4 font-display">Hire Proven Leaders</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-neutral-gray">Access a pool of pre-vetted, disciplined professionals.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-neutral-gray">Take advantage of Work Opportunity Tax Credits (WOTC).</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-neutral-gray">Reduce turnover with employees known for loyalty and grit.</p>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners Ecosystem */}
      <section className="bg-neutral-light py-20 border-t border-neutral-gray/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 font-display">Powered by a World-Class Ecosystem</h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
              We don't just find you a job. We connect you with the education, community, and technology you need to thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Educational Partners */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">Education & Upskilling</h3>
              <p className="text-neutral-gray mb-4">
                Universities and coding bootcamps offering credits for military service and gap-filling certifications.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">Coursera</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">EdX</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">Syracuse IVMF</span>
              </div>
            </div>

            {/* Government/Community */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">Government & Community</h3>
              <p className="text-neutral-gray mb-4">
                Direct integration with DoD SkillBridge and veteran service organizations for seamless transition support.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">DoD SkillBridge</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">VFW</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">VA</span>
              </div>
            </div>

            {/* Tech Integrations */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">HR Tech Integrations</h3>
              <p className="text-neutral-gray mb-4">
                Seamlessly integrated with major Applicant Tracking Systems (ATS) to ensure your application is seen.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">Workday</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">Greenhouse</span>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">SAP</span>
              </div>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="bg-primary text-white rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl font-bold mb-2 font-display">Become a Strategic Partner</h3>
              <p className="text-gray-200">
                Join our mission to employ 100,000 veterans by 2030. Gain access to diversity hiring pipelines and brand visibility.
              </p>
            </div>
            <button 
              onClick={() => navigate('/partners')}
              className="relative z-10 bg-white text-primary-dark font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-dark text-white py-20 mx-4 rounded-3xl overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
           <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Ready to Make the Switch?</h2>
           <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
             Whether you're looking for your next mission or your next leader, Boots2Suits is the bridge.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
               onClick={() => navigate('/signup')}
               className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-12 rounded-full text-lg transition-all shadow-lg shadow-accent/20"
             >
               Get Started Now
             </button>
           </div>
         </div>
      </section>
    </div>
  );
}
import React, { useState } from 'react';
import { Building2, GraduationCap, Handshake, CheckCircle, ArrowRight, Loader2, Globe, User, Mail, FileText, AlertCircle } from 'lucide-react';
import { partnerService } from '../services/partnerService';

const PartnersPage = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    type: 'education', // education, government, corporate, other
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await partnerService.createInquiry(formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        organizationName: '',
        contactName: '',
        email: '',
        type: 'education',
        message: ''
      });
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setError('Failed to submit your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light font-sans text-neutral-dark">
      {/* Hero Section */}
      <section className="bg-primary-dark text-white py-20 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Join the Boots2Suits Ecosystem
          </h1>
          <p className="text-xl text-neutral-gray max-w-3xl mx-auto mb-8">
            Partner with us to build the most comprehensive transition pipeline for military veterans. 
            Together, we can bridge the gap between service and success.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-gray/10">
              <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Educational Institutions</h3>
              <p className="text-neutral-gray/80 mb-4">
                Connect veterans with degree programs, certifications, and upskilling opportunities tailored to their military experience.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Direct pipeline to motivated students</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Skill-gap analysis integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-gray/10">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Government Agencies</h3>
              <p className="text-neutral-gray/80 mb-4">
                Streamline transition assistance programs (TAP) and ensure veterans access the benefits they've earned.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Data-driven outcome tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Seamless benefits integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-gray/10">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">HR Tech & Corporate</h3>
              <p className="text-neutral-gray/80 mb-4">
                Integrate your ATS or hiring platform to access a pre-vetted, high-performance talent pool.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>API-first integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>DEI goal acceleration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto border border-neutral-light">
            <div className="grid md:grid-cols-5">
              <div className="bg-primary-dark text-white p-12 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Handshake className="w-48 h-48 transform translate-x-12 -translate-y-12" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/40 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 font-display leading-tight">Let's Build Together</h3>
                  <p className="text-gray-300 mb-10 leading-relaxed text-lg">
                    Fill out the form and our partnerships team will be in touch within 24 hours to schedule a discovery call.
                  </p>
                </div>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors border border-white/10">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <span className="block font-bold text-lg">Strategic Alliances</span>
                      <span className="text-sm text-gray-400">Expand your reach</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors border border-white/10">
                      <CheckCircle className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <span className="block font-bold text-lg">API Integrations</span>
                      <span className="text-sm text-gray-400">Seamless data sync</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors border border-white/10">
                      <User className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <span className="block font-bold text-lg">Community Growth</span>
                      <span className="text-sm text-gray-400">Impact veteran lives</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 md:p-14 md:col-span-3 bg-white">
                <div className="mb-8">
                   <h2 className="text-2xl font-bold text-neutral-dark mb-2">Partnership Inquiry</h2>
                   <p className="text-neutral-gray">Tell us a bit about your organization.</p>
                </div>

                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50/50 rounded-2xl border border-green-100">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-green-200 shadow-lg">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary-dark mb-4">Request Received!</h3>
                    <p className="text-neutral-gray mb-8 max-w-sm mx-auto text-lg">
                      Thank you for your interest in partnering with Boots2Suits. We've sent a confirmation email and will be in touch shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3 bg-white border border-neutral-light text-primary font-bold rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="orgType" className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wide">Organization Type</label>
                      <div className="relative group">
                        <select 
                          id="orgType"
                          className="w-full pl-11 pr-10 py-4 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer text-neutral-dark font-medium"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                          <option value="education">Educational Institution</option>
                          <option value="government">Government Agency</option>
                          <option value="corporate">Corporate / HR Tech</option>
                          <option value="nonprofit">Non-Profit Organization</option>
                          <option value="other">Other</option>
                        </select>
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none border-l pl-3 border-neutral-200">
                          <ArrowRight className="w-4 h-4 text-neutral-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="orgName" className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wide">Organization Name</label>
                        <div className="relative group">
                          <input 
                            id="orgName"
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-neutral-dark placeholder-neutral-400"
                            placeholder="e.g. State University"
                            value={formData.organizationName}
                            onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                          />
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wide">Contact Name</label>
                        <div className="relative group">
                          <input 
                            id="contactName"
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-neutral-dark placeholder-neutral-400"
                            placeholder="e.g. John Smith"
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wide">Work Email</label>
                      <div className="relative group">
                        <input 
                          id="email"
                          type="email"
                          required
                          className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-neutral-dark placeholder-neutral-400"
                          placeholder="john@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wide">Partnership Interest</label>
                      <div className="relative group">
                        <textarea 
                          id="message"
                          rows={4}
                          required
                          className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-neutral-dark placeholder-neutral-400"
                          placeholder="Tell us how you'd like to partner..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                        <FileText className="absolute left-4 top-5 text-neutral-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] text-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          Submit Partnership Inquiry
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mt-4 border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;

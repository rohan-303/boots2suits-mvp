import React, { useState } from 'react';
import { Building2, GraduationCap, Handshake, CheckCircle, ArrowRight, Loader2, Globe, User, Mail, FileText } from 'lucide-react';
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
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Direct pipeline to motivated students</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Skill-gap analysis integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-gray/10">
              <div className="bg-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Government Agencies</h3>
              <p className="text-neutral-gray/80 mb-4">
                Streamline transition assistance programs (TAP) and ensure veterans access the benefits they've earned.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Data-driven outcome tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
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
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>API-first integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>DEI goal acceleration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-neutral-gray/10">
            <div className="grid md:grid-cols-5">
              <div className="bg-primary-dark text-white p-12 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Handshake className="w-32 h-32" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 font-display">Let's Build Together</h3>
                  <p className="text-neutral-gray mb-8 leading-relaxed">
                    Fill out the form and our partnerships team will be in touch within 24 hours to schedule a discovery call.
                  </p>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Globe className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span className="block font-bold">Strategic Alliances</span>
                      <span className="text-xs text-neutral-gray">Expand your reach</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span className="block font-bold">API Integrations</span>
                      <span className="text-xs text-neutral-gray">Seamless data sync</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span className="block font-bold">Community Growth</span>
                      <span className="text-xs text-neutral-gray">Impact veteran lives</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-12 md:col-span-3">
                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-dark mb-3">Request Received!</h3>
                    <p className="text-neutral-gray/80 mb-8 max-w-sm mx-auto">
                      Thank you for your interest in partnering with Boots2Suits. We've sent a confirmation email and will be in touch shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="orgType" className="block text-sm font-bold text-neutral-dark mb-2">Organization Type</label>
                      <div className="relative">
                        <select 
                          id="orgType"
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-gray/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                          <option value="education">Educational Institution</option>
                          <option value="government">Government Agency</option>
                          <option value="corporate">Corporate / HR Tech</option>
                          <option value="nonprofit">Non-Profit Organization</option>
                          <option value="other">Other</option>
                        </select>
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5 pointer-events-none" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none border-l pl-2 border-neutral-gray/20">
                          <ArrowRight className="w-4 h-4 text-neutral-gray rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="orgName" className="block text-sm font-bold text-neutral-dark mb-2">Organization Name</label>
                        <div className="relative">
                          <input 
                            id="orgName"
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-gray/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="e.g. State University"
                            value={formData.organizationName}
                            onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                          />
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-bold text-neutral-dark mb-2">Contact Name</label>
                        <div className="relative">
                          <input 
                            id="contactName"
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-gray/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="e.g. John Smith"
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-neutral-dark mb-2">Work Email</label>
                      <div className="relative">
                        <input 
                          id="email"
                          type="email"
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-gray/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="john@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-neutral-dark mb-2">Partnership Interest</label>
                      <div className="relative">
                        <textarea 
                          id="message"
                          rows={4}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-gray/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          placeholder="Tell us how you'd like to partner..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                        <FileText className="absolute left-3 top-4 text-neutral-gray w-5 h-5" />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Partnership Inquiry
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    {error && (
                      <p className="text-red-500 text-sm text-center mt-2 bg-red-50 p-2 rounded">{error}</p>
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

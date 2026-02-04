import React, { useState } from 'react';
import { 
  Video, 
  Users, 
  ExternalLink, 
  Search, 
  FileText, 
  MessageSquare,
  Heart, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface ResourceItem {
  title: string;
  desc: string;
  link: string;
  tags: string[];
  featured?: boolean;
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ResourceItem[];
}

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const resources: ResourceCategory[] = [
    {
      id: "tools",
      title: "Transition Tools (O*NET)",
      icon: <Compass className="w-5 h-5" />,
      items: [
        { 
          title: "My Next Move for Veterans", 
          desc: "The ultimate tool for MOS translation. Enter your military code to find equivalent civilian careers, salary data, and job outlooks.", 
          link: "https://www.mynextmove.org/vets/", 
          tags: ["O*NET", "MOS Translator", "Career Path"],
          featured: true
        },
        { 
          title: "O*NET Interest Profiler", 
          desc: "Not sure what you want to do? Take this 60-question assessment to find careers that match your interests.", 
          link: "https://www.mynextmove.org/explore/ip", 
          tags: ["Assessment", "Career Discovery"] 
        },
        { 
          title: "O*NET Crosswalk Search", 
          desc: "Direct mapping of military classifications to civilian occupational codes.", 
          link: "https://www.onetonline.org/crosswalk/", 
          tags: ["Data", "Research"] 
        }
      ]
    },
    {
      id: "resume",
      title: "Resume Templates",
      icon: <FileText className="w-5 h-5" />,
      items: [
        { 
          title: "Google Resume Templates for Veterans", 
          desc: "Professional templates designed specifically to highlight military experience.", 
          link: "https://docs.google.com/document/u/0/?ftv=1&tgif=d", 
          tags: ["Templates", "Resume"],
          featured: true
        },
        { 
          title: "Novorésumé Military to Civilian", 
          desc: "Expert guides and templates for translating military service into a civilian resume.", 
          link: "https://novoresume.com/career-blog/military-veteran-resume", 
          tags: ["Templates", "Guide"] 
        },
        { 
          title: "VA Resume Building Guide", 
          desc: "Official VA guidance on crafting a federal resume and highlighting transferable skills.", 
          link: "https://www.va.gov/careers-employment/vocational-rehabilitation/resources/resume-building/", 
          tags: ["Federal", "Guide"] 
        }
      ]
    },
    {
      id: "interview",
      title: "Interview Prep",
      icon: <MessageSquare className="w-5 h-5" />,
      items: [
        { 
          title: "Interview Warmup by Google", 
          desc: "Practice answering interview questions and get real-time insights to improve your answers.", 
          link: "https://grow.google/certificates/interview-warmup/", 
          tags: ["AI", "Practice"],
          featured: true
        },
        { 
          title: "STAR Method Guide", 
          desc: "Master the 'Situation, Task, Action, Result' technique for answering behavioral interview questions.", 
          link: "https://www.vawizards.org/VW/STAR_Method", 
          tags: ["Interview", "Guide"] 
        },
        { 
          title: "Big Interview for Veterans", 
          desc: "A training system that combines expert training with AI-based practice tools.", 
          link: "https://biginterview.com/veterans/", 
          tags: ["Training", "AI"] 
        }
      ]
    },
    {
      id: "education",
      title: "Upskilling & Education",
      icon: <Video className="w-5 h-5" />,
      items: [
        { 
          title: "Coursera for Veterans", 
          desc: "Free access to Google & Meta certifications through various veteran partnerships.", 
          link: "https://www.coursera.org/social-impact/veterans", 
          tags: ["Certifications", "Tech"] 
        },
        { 
          title: "VA VET TEC Program", 
          desc: "Tuition and housing for high-tech training programs (Coding, IT, Cyber).", 
          link: "https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/", 
          tags: ["VA Benefits", "Funding"] 
        },
        { 
          title: "LinkedIn Learning", 
          desc: "One year of Premium subscription for veterans, including thousands of courses.", 
          link: "https://socialimpact.linkedin.com/programs/veterans/premiumform", 
          tags: ["Courses", "Premium"] 
        }
      ]
    },
    {
      id: "mentorship",
      title: "Mentorship Networks",
      icon: <Users className="w-5 h-5" />,
      items: [
        { 
          title: "American Corporate Partners", 
          desc: "1-on-1 year-long mentorship with leaders from Fortune 500 companies.", 
          link: "https://www.acp-usa.org/", 
          tags: ["Mentorship", "Networking"] 
        },
        { 
          title: "Veterati", 
          desc: "On-demand mentorship conversations with successful veterans and military spouses.", 
          link: "https://www.veterati.com/", 
          tags: ["Networking", "Calls"] 
        }
      ]
    },
    {
      id: "benefits",
      title: "Benefits & Health",
      icon: <Heart className="w-5 h-5" />,
      items: [
        { 
          title: "VA Health Care", 
          desc: "Apply for VA health care, manage your appointments, and refill prescriptions.", 
          link: "https://www.va.gov/health-care/", 
          tags: ["Healthcare", "VA"] 
        },
        { 
          title: "eBenefits", 
          desc: "Manage your compensation, pension, education, and other benefits.", 
          link: "https://www.ebenefits.va.gov/ebenefits/homepage", 
          tags: ["Benefits", "Admin"] 
        }
      ]
    }
  ];

  // Filter resources
  const filteredResources = resources.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || activeCategory === cat.id;
      return matchesSearch && matchesCategory;
    })
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-[#4A5D23] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Veteran Resource Command Center
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Equip yourself with the best tools for your civilian mission. 
              From O*NET MOS translators to resume templates and mentorship networks.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Search resources (e.g., 'MOS translator', 'resume', 'python')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl pl-12 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#C5A059]/50 shadow-lg"
              />
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 py-4 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all' 
                  ? 'bg-[#4A5D23] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Resources
            </button>
            {resources.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[#4A5D23] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {filteredResources.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
            </div>
          )}

          {filteredResources.map((section) => (
            <div key={section.id} className="scroll-mt-24" id={section.id}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#4A5D23]/10 rounded-lg text-[#4A5D23]">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      item.featured 
                        ? 'border-[#C5A059] ring-1 ring-[#C5A059]/20' 
                        : 'border-gray-100 hover:border-[#4A5D23]/30'
                    }`}
                  >
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md group-hover:bg-[#4A5D23]/10 group-hover:text-[#4A5D23] transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#4A5D23] transition-colors" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4A5D23] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    
                    {item.featured && (
                      <div className="px-6 py-3 bg-[#C5A059]/10 border-t border-[#C5A059]/20 rounded-b-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Recommended Tool</span>
                        <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* O*NET CTA */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
            <Compass className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by O*NET Data</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our platform leverages the official Occupational Information Network (O*NET) database 
            to ensure your skills are matched accurately to civilian job markets.
          </p>
          <a 
            href="https://www.onetonline.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A5D23]"
          >
            Learn more about O*NET
            <ExternalLink className="ml-2 -mr-1 h-5 w-5 text-gray-400" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;

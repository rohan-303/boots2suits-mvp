import { BookOpen, Video, Users, ExternalLink, Search } from 'lucide-react';

const ResourcesPage = () => {
  const resources = [
    {
      category: "Transition Guides",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      items: [
        { title: "Military to Civilian Resume Guide", desc: "Learn how to translate your MOS to corporate speak.", link: "#" },
        { title: "Interview Prep 101", desc: "Master the behavioral interview questions.", link: "#" },
        { title: "Salary Negotiation", desc: "Know your worth in the private sector.", link: "#" }
      ]
    },
    {
      category: "Upskilling & Education",
      icon: <Video className="w-6 h-6 text-secondary" />,
      items: [
        { title: "Coursera for Veterans", desc: "Free access to Google & Meta certifications.", link: "#" },
        { title: "VET TEC Programs", desc: "High-tech training paid for by the VA.", link: "#" },
        { title: "LinkedIn Learning", desc: "One year of Premium for veterans.", link: "#" }
      ]
    },
    {
      category: "Mentorship Networks",
      icon: <Users className="w-6 h-6 text-accent" />,
      items: [
        { title: "American Corporate Partners", desc: "1-on-1 mentorship with Fortune 500 leaders.", link: "#" },
        { title: "Veterati", desc: "On-demand mentorship conversations.", link: "#" },
        { title: "FourBlock", desc: "Career readiness program and networking.", link: "#" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-light font-sans text-neutral-dark">
      {/* Hero */}
      <section className="bg-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold font-display mb-4">Veteran Resource Hub</h1>
          <p className="text-xl text-neutral-gray max-w-2xl">
            Curated tools, guides, and programs to accelerate your transition journey. 
            All resources are verified for veteran eligibility.
          </p>
          
          <div className="mt-8 relative max-w-xl">
            <input 
              type="text" 
              placeholder="Search resources (e.g., 'resume', 'python', 'mentorship')"
              className="w-full px-6 py-4 rounded-lg pl-12 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <Search className="absolute left-4 top-4 text-neutral-gray/60 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold">{section.category}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <a 
                      key={i} 
                      href={item.link}
                      className="block bg-white p-6 rounded-xl shadow-sm border border-neutral-gray/10 hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-neutral-gray/40 group-hover:text-primary" />
                      </div>
                      <p className="text-sm text-neutral-gray/80">
                        {item.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-neutral-gray/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Have a resource to share?</h2>
          <p className="text-neutral-gray mb-8">
            Help us build the most comprehensive database of veteran resources.
          </p>
          <button className="bg-white border-2 border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary hover:text-white transition-colors">
            Submit a Resource
          </button>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;

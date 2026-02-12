import { Target, Users, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,#22c55e_1px,transparent_1px),linear-gradient(150deg,#22c55e_1px,transparent_1px)] bg-size-[20px_20px] mask-[linear-gradient(to_bottom,white,transparent)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Our Mission</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between military service and corporate success. We empower veterans with the tools, resources, and connections they need to thrive in their civilian careers.
          </p>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold font-display text-neutral-dark mb-6">Why Boots2Suits?</h2>
              <p className="text-neutral-gray mb-6 leading-relaxed">
                Transitioning from military to civilian life is one of the most challenging periods in a veteran's life. The skills learned in service—leadership, discipline, strategic thinking—are invaluable, but often difficult to translate into corporate language.
              </p>
              <p className="text-neutral-gray mb-6 leading-relaxed">
                Boots2Suits was founded to solve this translation problem. We use advanced AI to help veterans articulate their value, and we build partnerships with employers who understand the worth of a veteran hire.
              </p>
              <div className="space-y-4">
                {[
                  "AI-Powered Resume Translation",
                  "Direct Connections to Veteran-Ready Employers",
                  "Personalized Career Pathing",
                  "Community Support & Mentorship"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-neutral-dark font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-secondary/10 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaboration" 
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-light/30 p-8 rounded-xl text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-neutral-light">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Our Vision</h3>
              <p className="text-neutral-gray">
                A world where every veteran finds meaningful, rewarding employment that honors their service and utilizes their full potential.
              </p>
            </div>
            <div className="bg-neutral-light/30 p-8 rounded-xl text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-neutral-light">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Community First</h3>
              <p className="text-neutral-gray">
                We believe in the power of connection. By bringing together veterans, mentors, and employers, we create an ecosystem of success.
              </p>
            </div>
            <div className="bg-neutral-light/30 p-8 rounded-xl text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-neutral-light">
              <div className="w-16 h-16 bg-primary-dark/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-dark">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Excellence</h3>
              <p className="text-neutral-gray">
                Just as our veterans served with excellence, we are committed to providing the highest quality tools and resources for their transition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-light py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-neutral-dark mb-6">Ready to Start Your Journey?</h2>
          <p className="text-neutral-gray mb-8 text-lg">
            Whether you're a veteran looking for your next career move or an employer seeking top talent, Boots2Suits is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-neutral-dark font-semibold rounded-lg shadow border border-neutral-light hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

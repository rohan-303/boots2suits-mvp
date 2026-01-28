import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, User, ChevronRight, Check } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

type UserRole = 'veteran' | 'employer' | null;

export function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    militaryBranch: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Registration:', { role, ...formData });
    // TODO: Connect to backend API
    navigate('/dashboard');
  };

  // Step 1: Role Selection
  if (!role) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-secondary py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-primary-dark mb-4">
            Join Boots2Suits
          </h1>
          <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
            Select your role to get started with your tailored experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Veteran Card */}
          <button
            onClick={() => setRole('veteran')}
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary text-left"
          >
            <div className="absolute top-6 right-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors">
              I am a Veteran
            </h3>
            <p className="text-neutral-gray mb-6">
              Translate your military skills, build your AI persona, and find civilian careers that value your service.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> AI Resume Builder
              </li>
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> Skill Translation
              </li>
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> Exclusive Job Matches
              </li>
            </ul>
            <span className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
              Join as Veteran <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </button>

          {/* Employer Card */}
          <button
            onClick={() => setRole('employer')}
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-accent text-left"
          >
            <div className="absolute top-6 right-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-primary-dark mb-2 group-hover:text-accent transition-colors">
              I am an Employer
            </h3>
            <p className="text-neutral-gray mb-6">
              Find disciplined, skilled, and vetted veteran talent for your organization.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> Post Unlimited Jobs
              </li>
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> Advanced Candidate Search
              </li>
              <li className="flex items-center text-sm text-neutral-dark">
                <Check className="w-4 h-4 text-accent mr-2" /> Direct Messaging
              </li>
            </ul>
            <span className="inline-flex items-center text-accent font-semibold group-hover:translate-x-1 transition-transform">
              Join as Employer <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <button 
            onClick={() => setRole(null)}
            className="text-sm text-neutral-gray hover:text-primary mb-4 flex items-center"
          >
            ← Back to Role Selection
          </button>
          <h2 className="text-3xl font-heading font-bold text-primary-dark">
            Create {role === 'veteran' ? 'Veteran' : 'Employer'} Account
          </h2>
          <p className="mt-2 text-sm text-neutral-gray">
            Enter your details below to create your account.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {role === 'employer' && (
              <div>
                <label htmlFor="companyName" className="sr-only">Company Name</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            )}

            {role === 'veteran' && (
              <div>
                <label htmlFor="militaryBranch" className="sr-only">Military Branch</label>
                <select
                  id="militaryBranch"
                  name="militaryBranch"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  value={formData.militaryBranch}
                  onChange={handleChange}
                >
                  <option value="">Select Branch of Service</option>
                  <option value="Army">Army</option>
                  <option value="Navy">Navy</option>
                  <option value="Air Force">Air Force</option>
                  <option value="Marines">Marine Corps</option>
                  <option value="Coast Guard">Coast Guard</option>
                  <option value="Space Force">Space Force</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Create Account
            </button>
          </div>
          
          <div className="text-center text-xs text-neutral-gray">
            By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, ChevronRight, Check, Loader2, AlertCircle } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import { register } from '../services/authService';

type UserRole = 'veteran' | 'employer' | null;

export function SignupPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: role || 'veteran',
        companyName: role === 'employer' ? formData.companyName : undefined,
        militaryBranch: role === 'veteran' ? formData.militaryBranch : undefined,
      });

      login(response);
    } catch (err: unknown) {
      console.error('Signup Error Detail:', err);
      const error = err as any;
      const message = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Sign in
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <SocialAuthButtons 
            mode="signup" 
            role={role}
            formData={formData}
            onError={setError}
          />
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-gray">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-dark mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-dark mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {role === 'employer' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-neutral-dark mb-1">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            )}

            {role === 'veteran' && (
              <div>
                <label htmlFor="militaryBranch" className="block text-sm font-medium text-neutral-dark mb-1">
                  Military Branch
                </label>
                <select
                  id="militaryBranch"
                  name="militaryBranch"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                  value={formData.militaryBranch}
                  onChange={handleChange}
                >
                  <option value="">Select Branch</option>
                  <option value="Army">Army</option>
                  <option value="Navy">Navy</option>
                  <option value="Air Force">Air Force</option>
                  <option value="Marines">Marines</option>
                  <option value="Coast Guard">Coast Guard</option>
                  <option value="Space Force">Space Force</option>
                  <option value="Army National Guard">Army National Guard</option>
                  <option value="Air National Guard">Air National Guard</option>
                  <option value="Army Reserve">Army Reserve</option>
                  <option value="Navy Reserve">Navy Reserve</option>
                  <option value="Marine Corps Reserve">Marine Corps Reserve</option>
                  <option value="Air Force Reserve">Air Force Reserve</option>
                  <option value="Coast Guard Reserve">Coast Guard Reserve</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Check className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading ? 'Creating Account...' : 'Create Account'}
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

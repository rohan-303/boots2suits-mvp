import { FileText, Target, Award, ArrowRight, Bot, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function VeteranDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-light">
        <h1 className="text-3xl font-heading font-bold text-primary-dark mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-neutral-gray text-lg mb-6">
          Your mission: Translate your service into a thriving civilian career.
        </p>
        
        {/* Persona Section */}
        {user?.persona?.role ? (
          <div className="bg-white border border-[#4A5D23]/20 rounded-lg p-6 flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A5D23]/5 rounded-bl-full -mr-10 -mt-10" />
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#4A5D23] p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your Professional Persona</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Military Role</p>
                  <p className="text-gray-900 font-medium">{user.persona.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Service</p>
                  <p className="text-gray-900 font-medium">{user.persona.yearsOfService} Years</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Career Goals</p>
                  <p className="text-gray-900 font-medium">{user.persona.goals}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/persona-builder')}
              className="relative z-10 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Edit Persona
            </button>
          </div>
        ) : (
          <div className="bg-[#4A5D23]/5 border border-[#4A5D23]/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#4A5D23]/10 p-3 rounded-full">
                <Bot className="w-8 h-8 text-[#4A5D23]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Complete Your AI Persona</h3>
                <p className="text-gray-600">Build a professional profile to get better job matches.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/persona-builder')}
              className="w-full md:w-auto px-6 py-3 bg-[#4A5D23] text-white font-bold rounded-lg hover:bg-[#3b4a1c] transition-colors flex items-center justify-center gap-2"
            >
              Start Builder <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Resume Builder */}
        <div 
          onClick={() => navigate('/resume-builder')}
          className="bg-white p-6 rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">AI Resume Builder</h3>
          <p className="text-neutral-gray mb-4 text-sm">
            Convert your military experience into a corporate-ready resume using our AI translator.
          </p>
          <span className="text-primary font-semibold text-sm flex items-center">
            Build Resume <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        {/* Job Matches */}
        <div 
          onClick={() => navigate('/jobs')}
          className="bg-white p-6 rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
            <Target className="w-6 h-6 text-accent-dark" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">Job Matches</h3>
          <p className="text-neutral-gray mb-4 text-sm">
            View jobs specifically matched to your MOS/AFSC and skill set.
          </p>
          <span className="text-accent-dark font-semibold text-sm flex items-center">
            View Matches <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        {/* Skill Translator */}
        <div 
          onClick={() => navigate('/persona-builder')}
          className="bg-white p-6 rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <BookOpen className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">Skill Translator</h3>
          <p className="text-neutral-gray mb-4 text-sm">
            Manually map your military certifications to civilian equivalents.
          </p>
          <span className="text-green-700 font-semibold text-sm flex items-center">
            Translate Skills <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
        <div className="p-6 border-b border-neutral-light flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-dark">Application Status</h2>
          <button 
            onClick={() => navigate('/veteran/applications')}
            className="text-primary font-semibold text-sm hover:underline"
          >
            View All
          </button>
        </div>
        <div className="p-8 text-center text-neutral-gray">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-light rounded-full mb-4">
            <Award className="w-8 h-8 text-neutral-gray" />
          </div>
          <p className="mb-4">Track your active job applications and interview status.</p>
          <button 
             onClick={() => navigate('/veteran/applications')}
             className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            Check Applications
          </button>
        </div>
      </div>
    </div>
  );
}

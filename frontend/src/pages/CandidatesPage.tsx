import React from 'react';
import { Search, MapPin, Briefcase, FileText, Download, MessageSquare, Star, Eye, ShieldCheck, Flag } from 'lucide-react';

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Marcus L. Bennett",
    role: "Facilities Manager",
    location: "Chicago, IL",
    matchScore: 95,
    badges: ["Security Clearance", "Veteran", "Facilities Mgmt"],
    summary: "Former Navy Facilities Manager with 8 years of experience overseeing military base maintenance operations. Expertise in security protocols and facility management systems.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Robert Wilson",
    role: "Facilities Coordinator",
    location: "Denver, CO",
    matchScore: 87,
    badges: ["Security Clearance", "Veteran", "Facilities Mgmt"],
    summary: "Army veteran with 6 years of experience in logistics and facilities management. Skilled in team leadership, budget management, and operational efficiency improvements.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "David Martinez",
    role: "Facilities Operations Manager",
    location: "Austin, TX",
    matchScore: 84,
    badges: ["Security Clearance", "Veteran", "Facilities Mgmt"],
    summary: "Marine Corps veteran with extensive experience in facility security and maintenance. Proven track record in managing complex operations and implementing cost-saving measures.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export function CandidatesPage() {
  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light">
          <h2 className="font-bold text-lg mb-4 text-neutral-dark">Filter Candidates</h2>
          
          <div className="space-y-6">
            {/* Highest Education */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Highest Education</h3>
              <div className="space-y-2">
                {['High School', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="education" className="text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Clearance */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Security Clearance</h3>
              <div className="space-y-2">
                {['Secret', 'Top Secret', 'None'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={item === 'Top Secret'} className="rounded text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Citizenship */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Citizenship Status</h3>
              <div className="space-y-2">
                {['U.S. Citizen', 'Green Card Holder', 'Other'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="citizenship" defaultChecked={item === 'U.S. Citizen'} className="text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-neutral-dark mb-2">Candidates</h1>
        <p className="text-neutral-gray mb-6">Browse matched veteran candidates for your job posts</p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, skills, or keywords" 
              className="w-full pl-10 pr-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Search Results
          </button>
        </div>

        {/* Selected Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-medium text-neutral-dark mr-2 py-1">Selected Filters:</span>
          {['Job Role: Facilities Manager', 'Security Clearance: Top Secret', 'Industry: Tech'].map((filter) => (
            <span key={filter} className="inline-flex items-center bg-green-100 text-primary-dark text-xs px-3 py-1 rounded-full font-medium">
              {filter}
              <button className="ml-2 hover:text-red-500">×</button>
            </span>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-neutral-dark font-medium">3 candidates matched</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-gray">Sort by:</span>
            <select className="text-sm font-medium border-none bg-transparent focus:ring-0 cursor-pointer">
              <option>Match Score</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {MOCK_CANDIDATES.map((candidate) => (
            <div key={candidate.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-dark">{candidate.name}</h3>
                      <div className="text-sm text-neutral-gray mb-2">
                        {candidate.role} <span className="mx-1">|</span> {candidate.location}
                      </div>
                    </div>
                    <div className="bg-green-100 text-primary-dark font-bold px-3 py-1 rounded text-sm">
                      {candidate.matchScore}% Match
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {candidate.badges.map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-dark text-xs px-2 py-1 rounded font-medium">
                        {badge.includes('Clearance') && <ShieldCheck className="w-3 h-3 text-green-600" />}
                        {badge.includes('Veteran') && <Flag className="w-3 h-3 text-blue-600" />}
                        {badge}
                      </span>
                    ))}
                  </div>

                  <p className="text-neutral-gray text-sm mb-4 leading-relaxed">
                    {candidate.summary}
                  </p>

                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50">
                      <FileText className="w-4 h-4" /> View Resume
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <div className="flex-1"></div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100">
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100">
                      <Star className="w-4 h-4" /> Save
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded text-sm hover:bg-primary-light">
                      <Eye className="w-4 h-4" /> View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

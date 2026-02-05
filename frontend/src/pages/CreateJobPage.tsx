import { useState, useRef, useEffect } from 'react';
import { jobService } from '../services/jobService';
import type { CreateJobData, Job } from '../types/Job';
import { US_STATES, CITIES_BY_STATE, COMMON_SKILLS, MILITARY_BRANCHES, SECURITY_CLEARANCES } from '../utils/jobFormData';
import { 
  Plus, 
  X, 
  Briefcase, 
  Upload, 
  Loader2,
  List,
  Award,
  Search,
  ArrowLeft,
  CheckCircle,
  MapPin,
  DollarSign,
  Shield,
  Building
} from 'lucide-react';

export function CreateJobPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'active'>('create');
  // Sub-view for the create tab: 'edit' or 'preview'
  const [createStep, setCreateStep] = useState<'edit' | 'preview'>('edit');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    country: 'United States',
    state: '',
    city: '',
    location: '', // Computed
    type: 'Full-time',
    workMode: 'On-site',
    salaryRange: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    workExperience: {
      min: 0,
      max: 0
    },
    educationLevel: 'Bachelor\'s',
    educationField: '',
    keySkills: [],
    openings: 1,
    workTimings: {
      startTime: '09:00',
      endTime: '17:00'
    },
    hiringTimeline: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    },
    description: '',
    responsibilities: [], // Now an array
    requirements: [],
    veteranPreferences: {
      securityClearance: 'None',
      militaryBranch: 'Any',
      mosCodes: [],
      rankCategory: 'Any'
    }
  });
  
  // Local state for the textarea input
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [mosInput, setMosInput] = useState('');

  // Update computed location when city/state changes
  useEffect(() => {
    if (formData.city && formData.state) {
      setFormData(prev => ({ ...prev, location: `${prev.city}, ${prev.state}, USA` }));
    }
  }, [formData.city, formData.state]);

  useEffect(() => {
    if (activeTab === 'active') {
      fetchActiveJobs();
    }
  }, [activeTab]);

  const fetchActiveJobs = async () => {
    setLoadingJobs(true);
    try {
      const jobs = await jobService.getMyJobs();
      setActiveJobs(jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof CreateJobData] as any,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Specific handler for veteran preferences
  const handleVeteranChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      veteranPreferences: {
        ...prev.veteranPreferences!,
        [field]: value
      }
    }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);
    
    if (value.length > 1) {
      const filtered = COMMON_SKILLS.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) && 
        !formData.keySkills.includes(skill)
      ).slice(0, 5);
      setSkillSuggestions(filtered);
    } else {
      setSkillSuggestions([]);
    }
  };

  const handleAddSkill = (skillToAdd?: string) => {
    const skill = skillToAdd || skillInput.trim();
    if (skill && !formData.keySkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        keySkills: [...prev.keySkills, skill]
      }));
      setSkillInput('');
      setSkillSuggestions([]);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter((_, i) => i !== index)
    }));
  };

  const handleAddMos = () => {
    if (mosInput.trim()) {
       setFormData(prev => ({
        ...prev,
        veteranPreferences: {
            ...prev.veteranPreferences!,
            mosCodes: [...(prev.veteranPreferences?.mosCodes || []), mosInput.trim()]
        }
      }));
      setMosInput('');
    }
  };
   const handleRemoveMos = (index: number) => {
    setFormData(prev => ({
        ...prev,
        veteranPreferences: {
            ...prev.veteranPreferences!,
            mosCodes: prev.veteranPreferences?.mosCodes?.filter((_, i) => i !== index)
        }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError('');

    try {
      const result = await jobService.parseJobDescription(file);
      if (result.data) {
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          description: result.data.description || prev.description,
          // Merge other fields if parsed
        }));
        
        // If parsing extracted responsibilities as text (unlikely but possible if updated), handle it
        // For now, assuming description might contain it, so user has to manually split or copy/paste
      }
    } catch (err) {
      setError('Failed to parse file. Please try entering details manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePreview = () => {
    // Validation
    if (!formData.title || !formData.company || !formData.description) {
        setError('Please fill in all required fields (Title, Company, Description)');
        window.scrollTo(0, 0);
        return;
    }

    // Convert responsibilities text to array
    const responsibilitiesArray = responsibilitiesText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    setFormData(prev => ({
        ...prev,
        responsibilities: responsibilitiesArray
    }));

    setCreateStep('preview');
    setError('');
    window.scrollTo(0, 0);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError('');

    try {
      await jobService.createJob(formData);
      setActiveTab('active');
      setCreateStep('edit'); // Reset to edit for next time
      // Reset form
      setFormData({
        title: '',
        company: '',
        country: 'United States',
        state: '',
        city: '',
        location: '',
        type: 'Full-time',
        workMode: 'On-site',
        salaryRange: { min: 0, max: 0, currency: 'USD' },
        workExperience: { min: 0, max: 0 },
        educationLevel: 'Bachelor\'s',
        educationField: '',
        keySkills: [],
        openings: 1,
        workTimings: { startTime: '09:00', endTime: '17:00' },
        hiringTimeline: { startDate: new Date().toISOString().split('T')[0], endDate: '' },
        description: '',
        responsibilities: [],
        requirements: [],
        veteranPreferences: { securityClearance: 'None', militaryBranch: 'Any', mosCodes: [], rankCategory: 'Any' }
      });
      setResponsibilitiesText('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
      // If error, stay on preview or go back? Stay on preview so they can retry or edit.
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-neutral-light/30 py-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs - Only show when not in preview mode or when active tab is 'active' */}
        {createStep === 'edit' && (
             <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-neutral-light w-fit mx-auto">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'create' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-neutral-gray hover:text-primary hover:bg-neutral-light/50'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Post a Job
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'active' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-neutral-gray hover:text-primary hover:bg-neutral-light/50'
                    }`}
                >
                    <List className="w-4 h-4" />
                    Active Jobs
                </button>
            </div>
        )}
        
        {activeTab === 'create' ? (
            createStep === 'edit' ? (
                // EDIT MODE
                <div className="bg-white rounded-2xl shadow-xl border border-neutral-light overflow-hidden">
                  {/* Header */}
                  <div className="bg-linear-to-r from-primary to-primary-dark p-8 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold font-cinzel">Create New Position</h1>
                        <p className="text-white/80 mt-1">Design the perfect role for a veteran candidate.</p>
                      </div>
                    </div>
                    
                    {/* File Upload Button */}
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".pdf,.txt,.doc,.docx"
                            onChange={handleFileUpload}
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isParsing}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-primary font-bold rounded-lg hover:bg-neutral-100 transition-colors shadow-lg"
                        >
                            {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isParsing ? 'Analyzing...' : 'Auto-Fill from JD'}
                        </button>
                        <p className="text-xs text-white/70 mt-2 text-center">Supports PDF, DOCX</p>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-10">
                    {error && (
                      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        {error}
                      </div>
                    )}
                    
                    {/* SECTION 1: ROLE DETAILS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                            <h3 className="text-xl font-bold text-neutral-dark">Role Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-11">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">Job Title</label>
                                <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-neutral-light/10"
                                placeholder="e.g. Senior Operations Manager"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">Company Name</label>
                                <input
                                type="text"
                                name="company"
                                required
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-neutral-light/10"
                                placeholder="e.g. Defense Solutions Inc."
                                />
                            </div>
                            
                            <div className="col-span-2">
                                 <label className="block text-sm font-semibold text-neutral-dark mb-2">Role Overview (Description)</label>
                                 <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-neutral-light/10"
                                    placeholder="Briefly describe the role and its impact..."
                                 />
                            </div>
                            
                             <div className="col-span-2">
                                 <label className="block text-sm font-semibold text-neutral-dark mb-2">Key Responsibilities</label>
                                 <textarea
                                    name="responsibilities"
                                    required
                                    rows={6}
                                    value={responsibilitiesText}
                                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-neutral-light/10"
                                    placeholder="• Lead daily operations...&#10;• Manage cross-functional teams...&#10;• Ensure compliance with safety standards..."
                                 />
                                 <p className="text-xs text-neutral-gray mt-1">Enter each responsibility on a new line. We will convert them to bullet points.</p>
                            </div>

                            <div className="col-span-2">
                                 <label className="block text-sm font-semibold text-neutral-dark mb-2">Requirements</label>
                                 <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={requirementInput}
                                        onChange={(e) => setRequirementInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                                        className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-neutral-light/10"
                                        placeholder="Add a requirement (e.g. 5+ years of experience)"
                                    />
                                    <button type="button" onClick={handleAddRequirement} className="bg-neutral-dark text-white px-4 rounded-xl font-bold hover:bg-neutral-800 transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                 </div>
                                 <div className="space-y-2">
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} className="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50 group">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <p className="text-sm text-neutral-dark grow">{req}</p>
                                            <button type="button" onClick={() => handleRemoveRequirement(index)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-neutral-light/50" />

                    {/* SECTION 2: LOCATION & WORK MODE */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                            <h3 className="text-xl font-bold text-neutral-dark">Location & Schedule</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pl-11">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">Country</label>
                                <select
                                    name="country"
                                    disabled
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed"
                                >
                                    <option>United States</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                >
                                    <option value="">Select State</option>
                                    {US_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">City</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!formData.state}
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white disabled:bg-neutral-50 disabled:text-neutral-400"
                                >
                                    <option value="">Select City</option>
                                    {formData.state && CITIES_BY_STATE[formData.state]?.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                    {(!formData.state || !CITIES_BY_STATE[formData.state]) && <option value="Other">Other</option>}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">Work Mode</label>
                                <div className="flex gap-2">
                                    {['On-site', 'Remote', 'Hybrid'].map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, workMode: mode }))}
                                            className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                                                formData.workMode === mode 
                                                ? 'bg-primary text-white border-primary' 
                                                : 'bg-white text-neutral-gray border-neutral-light hover:border-primary/50'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <label className="block text-sm font-semibold text-neutral-dark mb-2">Schedule</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <hr className="border-neutral-light/50" />

                    {/* SECTION 3: VETERAN & SKILLS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                            <h3 className="text-xl font-bold text-neutral-dark">Veteran Preference & Skills</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-11">
                            {/* Veteran Specifics */}
                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 space-y-4">
                                <h4 className="font-bold text-primary flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Veteran Requirements
                                </h4>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Security Clearance</label>
                                    <select
                                        value={formData.veteranPreferences?.securityClearance}
                                        onChange={(e) => handleVeteranChange('securityClearance', e.target.value)}
                                        className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        {SECURITY_CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                 <div>
                                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Preferred Branch</label>
                                    <select
                                        value={formData.veteranPreferences?.militaryBranch}
                                        onChange={(e) => handleVeteranChange('militaryBranch', e.target.value)}
                                        className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="Any">Any Branch</option>
                                        {MILITARY_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                 <div>
                                    <label className="block text-sm font-semibold text-neutral-dark mb-2">MOS/AFSC Codes (Optional)</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={mosInput}
                                            onChange={(e) => setMosInput(e.target.value)}
                                            className="grow px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="e.g. 11B, 25U"
                                        />
                                        <button type="button" onClick={handleAddMos} className="bg-primary text-white px-3 rounded-lg"><Plus className="w-4 h-4"/></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.veteranPreferences?.mosCodes?.map((code, i) => (
                                            <span key={i} className="bg-white border border-neutral-light text-neutral-dark px-2 py-1 rounded text-xs flex items-center gap-1">
                                                {code}
                                                <button type="button" onClick={() => handleRemoveMos(i)}><X className="w-3 h-3 text-red-500"/></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Autocomplete */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-neutral-dark flex items-center gap-2">
                                    <Search className="w-5 h-5 text-neutral-gray" />
                                    Key Skills
                                </h4>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Add Skills</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={handleSkillInputChange}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            className="grow px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Type to search skills..."
                                        />
                                        <button type="button" onClick={() => handleAddSkill()} className="bg-neutral-dark text-white px-4 rounded-lg"><Plus className="w-5 h-5"/></button>
                                    </div>
                                    {/* Suggestions Dropdown */}
                                    {skillSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-full bg-white border border-neutral-light rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                            {skillSuggestions.map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => handleAddSkill(skill)}
                                                    className="w-full text-left px-4 py-2 hover:bg-primary/5 text-sm text-neutral-dark transition-colors"
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.keySkills.map((skill, index) => (
                                        <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(index)} className="hover:text-red-200"><X className="w-3 h-3"/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Review Button */}
                    <div className="pt-6 border-t border-neutral-light flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="px-10 py-4 bg-neutral-dark text-white rounded-xl hover:bg-neutral-800 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                      >
                        Review Job Listing
                      </button>
                    </div>
                  </div>
                </div>
            ) : (
                // PREVIEW MODE
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-neutral-light">
                        <button 
                            onClick={() => setCreateStep('edit')}
                            className="flex items-center text-neutral-gray hover:text-primary transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Editing
                        </button>
                        <h2 className="text-xl font-bold font-cinzel text-neutral-dark">Preview Job Posting</h2>
                        <div className="w-24"></div> {/* Spacer for alignment */}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
                        <div className="p-8 border-b border-neutral-light">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-20 h-20 bg-primary/5 rounded-xl border border-neutral-light flex items-center justify-center text-primary font-bold text-3xl shrink-0">
                                    {formData.company.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-neutral-dark font-heading">{formData.title}</h1>
                                            <div className="flex items-center gap-2 text-lg text-neutral-gray mt-1 font-medium">
                                                <Building className="w-5 h-5" />
                                                {formData.company}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-light/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-50 rounded-lg"><MapPin className="w-5 h-5 text-neutral-gray" /></div>
                                            <div>
                                                <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Location</p>
                                                <p className="text-sm font-semibold text-neutral-dark">{formData.city}, {formData.state}</p>
                                                <p className="text-xs text-neutral-gray">({formData.workMode})</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-50 rounded-lg"><Briefcase className="w-5 h-5 text-neutral-gray" /></div>
                                            <div>
                                                <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Job Type</p>
                                                <p className="text-sm font-semibold text-neutral-dark">{formData.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-50 rounded-lg"><DollarSign className="w-5 h-5 text-neutral-gray" /></div>
                                            <div>
                                                <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Salary</p>
                                                <p className="text-sm font-semibold text-neutral-dark">
                                                    {formData.salaryRange && formData.salaryRange.min ? `${formData.salaryRange.currency} ${formData.salaryRange.min.toLocaleString()} - ${formData.salaryRange.max.toLocaleString()}` : 'Competitive'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Veteran Requirements Card */}
                    {(formData.veteranPreferences?.securityClearance !== 'None' || formData.veteranPreferences?.militaryBranch !== 'Any' || (formData.veteranPreferences?.mosCodes && formData.veteranPreferences.mosCodes.length > 0)) && (
                        <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-xl shadow-md overflow-hidden text-white relative p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-accent" />
                                <h2 className="text-xl font-bold font-heading">Veteran Requirements</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.veteranPreferences?.securityClearance !== 'None' && (
                                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1">Security Clearance</p>
                                        <p className="font-semibold text-lg">{formData.veteranPreferences?.securityClearance}</p>
                                    </div>
                                )}
                                {formData.veteranPreferences?.militaryBranch !== 'Any' && (
                                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1">Preferred Branch</p>
                                        <p className="font-semibold text-lg">{formData.veteranPreferences?.militaryBranch}</p>
                                    </div>
                                )}
                                {formData.veteranPreferences?.mosCodes && formData.veteranPreferences.mosCodes.length > 0 && (
                                    <div className="md:col-span-2 bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-2">Target MOS / AFSC Codes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.veteranPreferences.mosCodes.map((code, idx) => (
                                                <span key={idx} className="bg-accent text-primary-dark px-3 py-1 rounded-md text-sm font-bold shadow-sm">{code}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                             {/* Description */}
                             <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
                                <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                                    Job Description
                                </h3>
                                <div className="prose prose-neutral max-w-none text-neutral-dark/80 whitespace-pre-wrap leading-relaxed">
                                    {formData.description}
                                </div>
                            </div>

                            {/* Responsibilities */}
                            {formData.responsibilities && formData.responsibilities.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
                                    <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        Key Responsibilities
                                    </h3>
                                    <ul className="space-y-4">
                                        {formData.responsibilities.map((resp, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="text-neutral-dark/80 leading-relaxed">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                             {/* Requirements */}
                             <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
                                <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                                    Requirements
                                </h3>
                                <ul className="space-y-4">
                                    {formData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-4 p-4 bg-neutral-light/30 rounded-lg border border-neutral-light/50">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-neutral-dark font-medium">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-6 sticky top-6">
                                <button 
                                    onClick={handlePublish}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                >
                                    {isLoading ? 'Publishing...' : 'Confirm & Publish'}
                                </button>
                                <button 
                                    onClick={() => setCreateStep('edit')}
                                    className="w-full mt-4 bg-white border-2 border-neutral-light text-neutral-gray font-bold py-3 px-6 rounded-xl transition-all hover:bg-neutral-light flex items-center justify-center gap-2"
                                >
                                    Make Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        ) : (
            // ACTIVE JOBS TAB
            <div className="bg-white rounded-xl shadow-lg border border-neutral-light overflow-hidden p-6">
                <h2 className="text-xl font-bold text-neutral-dark font-cinzel mb-6">Your Active Job Postings</h2>
                 {loadingJobs ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : activeJobs.length === 0 ? (
                    <div className="text-center py-12 text-neutral-gray">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No active jobs found.</p>
                        <button 
                            onClick={() => setActiveTab('create')}
                            className="text-primary hover:underline mt-2"
                        >
                            Post your first job
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeJobs.map(job => (
                            <div key={job._id} className="border border-neutral-light rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white group">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-neutral-dark group-hover:text-primary transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-neutral-gray text-sm mt-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{job.company}</span>
                                            <span>•</span>
                                            <span>{job.city}, {job.state}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${job.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                            {job.isActive ? 'Active' : 'Closed'}
                                        </span>
                                        <p className="text-xs text-neutral-400">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                                        {job.workMode}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg border border-purple-100">
                                        {job.type}
                                    </span>
                                    {job.salaryRange?.min && (
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">
                                            ${(job.salaryRange.min/1000).toFixed(0)}k - ${(job.salaryRange.max/1000).toFixed(0)}k
                                        </span>
                                    )}
                                </div>

                                {/* Veteran Specifics Summary */}
                                {(job.veteranPreferences?.securityClearance !== 'None' || 
                                  job.veteranPreferences?.militaryBranch !== 'Any' || 
                                  (job.veteranPreferences?.mosCodes && job.veteranPreferences.mosCodes.length > 0)) && (
                                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-light/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Award className="w-4 h-4 text-primary" />
                                            <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wide">Veteran Requirements</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                            {job.veteranPreferences?.securityClearance !== 'None' && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500">Clearance:</span>
                                                    <span className="font-medium text-neutral-800">{job.veteranPreferences?.securityClearance}</span>
                                                </div>
                                            )}
                                            {job.veteranPreferences?.militaryBranch !== 'Any' && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500">Branch:</span>
                                                    <span className="font-medium text-neutral-800">{job.veteranPreferences?.militaryBranch}</span>
                                                </div>
                                            )}
                                            {job.veteranPreferences?.mosCodes && job.veteranPreferences.mosCodes.length > 0 && (
                                                <div className="col-span-1 sm:col-span-2 flex items-start gap-2 mt-1">
                                                    <span className="text-neutral-500 whitespace-nowrap">MOS Codes:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {job.veteranPreferences.mosCodes.map(code => (
                                                            <span key={code} className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-xs text-neutral-700 font-mono">
                                                                {code}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

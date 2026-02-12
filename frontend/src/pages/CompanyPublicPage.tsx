import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompanyById, type Company } from '../services/companyService';
import { jobService } from '../services/jobService';
import type { Job } from '../types/Job';
import { Building2, MapPin, Globe, Users, Briefcase, ArrowLeft } from 'lucide-react';

export function CompanyPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const companyData = await getCompanyById(id);
          setCompany(companyData);

          // Fetch jobs for this company
          const allJobs = await jobService.getJobs(); 
          
          // Client-side filtering
          const companyJobs = allJobs.filter((job) => {
             if (!job.companyId) return false;
             const jobCompanyId = typeof job.companyId === 'object' ? job.companyId._id : job.companyId;
             return jobCompanyId === id;
          });
          setJobs(companyJobs);

        } catch (error) {
          console.error('Failed to load company data', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (!company) {
    return <div className="text-center py-20">Company not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/companies" className="inline-flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Companies
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden mb-8">
        <div className="h-32 bg-linear-to-r from-primary/10 to-primary/5 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="h-24 w-24 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                    <Building2 className="h-12 w-12 text-primary" />
                )}
            </div>
          </div>
        </div>
        
        <div className="pt-14 pb-8 px-8">
            <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-gray mb-6">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {company.location || 'Location N/A'}</span>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Globe className="w-4 h-4 text-primary" /> Website
                  </a>
                )}
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> {company.size || 'Size N/A'}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> {company.industry}</span>
            </div>
            
            <div className="prose max-w-none text-neutral-dark bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-2">About Us</h3>
                <p className="leading-relaxed">{company.description || 'No description provided.'}</p>
            </div>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6 flex items-center gap-2">
          Open Positions <span className="text-sm font-normal text-neutral-gray bg-gray-100 px-2 py-1 rounded-full">{jobs.length}</span>
        </h2>

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-neutral-gray">No open positions at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <Link 
                key={job._id} 
                to={`/jobs/${job._id}`}
                className="block bg-white p-6 rounded-xl border border-neutral-light hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-gray mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Apply Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

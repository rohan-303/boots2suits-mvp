import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, type Company } from '../services/companyService';
import { Search, Building2, MapPin, Users } from 'lucide-react';

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies(searchTerm);
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchCompanies, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-4">Companies</h1>
        <p className="text-neutral-gray max-w-2xl">
          Explore companies committed to hiring veterans. Find your next mission with employers who value your service.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search companies by name, industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">Loading...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-neutral-gray">No companies found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <Link 
              key={company._id} 
              to={`/companies/${company._id}`}
              className="bg-white rounded-xl border border-neutral-light overflow-hidden hover:shadow-md hover:border-primary transition-all group flex flex-col h-full"
            >
              <div className="h-24 bg-gray-50 relative border-b border-gray-100">
                <div className="absolute -bottom-6 left-6">
                  <div className="h-16 w-16 bg-white rounded-lg border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-8 w-8 text-primary" />
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-8 pb-6 px-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-neutral-dark mb-1 group-hover:text-primary transition-colors">{company.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{company.industry}</p>
                <p className="text-sm text-neutral-gray line-clamp-3 mb-4 flex-1">
                  {company.description || 'No description available.'}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-gray pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {company.size || 'N/A'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

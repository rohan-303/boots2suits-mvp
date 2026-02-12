import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VeteranDashboard } from '../components/dashboard/VeteranDashboard';
import { EmployerDashboard } from '../components/dashboard/EmployerDashboard';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.role === 'employer' && !user.companyId) {
        navigate('/onboarding');
      }
    }
  }, [isLoading, isAuthenticated, navigate, user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {user.role === 'veteran' ? <VeteranDashboard /> : <EmployerDashboard />}
    </div>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import PersonaBuilderPage from './pages/PersonaBuilderPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { ApplicantsPage } from './pages/ApplicantsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import PartnersPage from './pages/PartnersPage';
import ResourcesPage from './pages/ResourcesPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { VeteranProfilePage } from './pages/VeteranProfilePage';
import { SavedCandidatesPage } from './pages/SavedCandidatesPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="resume-builder" element={<ResumeBuilderPage />} />
            <Route path="persona-builder" element={<PersonaBuilderPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="post-job" element={<CreateJobPage />} />
            <Route path="employer/jobs/:jobId/applicants" element={<ApplicantsPage />} />
            <Route path="veteran/applications" element={<MyApplicationsPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="stories" element={<SuccessStoriesPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="saved" element={<SavedCandidatesPage />} />
            <Route path="company-profile" element={<CompanyProfilePage />} />
            <Route path="profile" element={<VeteranProfilePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

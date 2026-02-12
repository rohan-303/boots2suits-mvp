import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { SavedCandidatesPage } from './pages/SavedCandidatesPage';
import { LinkedInCallback } from './pages/LinkedInCallback';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { EmployerOnboardingPage } from './pages/EmployerOnboardingPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyPublicPage } from './pages/CompanyPublicPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="onboarding" element={<EmployerOnboardingPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/:id" element={<CompanyPublicPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="messages" element={<MessagesPage />} />
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
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="saved" element={<SavedCandidatesPage />} />
            <Route path="profile" element={<CompanyProfilePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { CandidatesPage } from './pages/CandidatesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="dashboard" element={<div className="p-8 text-center text-neutral-gray">Dashboard Coming Soon</div>} />
          <Route path="jobs" element={<div className="p-8 text-center text-neutral-gray">Job Posts Coming Soon</div>} />
          <Route path="saved" element={<div className="p-8 text-center text-neutral-gray">Saved Candidates Coming Soon</div>} />
          <Route path="profile" element={<div className="p-8 text-center text-neutral-gray">Company Profile Coming Soon</div>} />
          <Route path="login" element={<div className="p-8 text-center text-neutral-gray">Login Page Coming Soon</div>} />
          <Route path="signup" element={<div className="p-8 text-center text-neutral-gray">Sign Up Page Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

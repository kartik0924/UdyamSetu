import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { EntrepreneurDashboard } from './pages/EntrepreneurDashboard';
import { ApprovalPathfinderPage } from './pages/ApprovalPathfinderPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { QueriesPage } from './pages/QueriesPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { DepartmentDashboardPage } from './pages/DepartmentDashboardPage';
import { InspectorDashboardPage } from './pages/InspectorDashboardPage';
import { DistrictAdminDashboardPage } from './pages/DistrictAdminDashboardPage';
import { CompliancePage } from './pages/CompliancePage';
import { GovernmentSupportPage } from './pages/GovernmentSupportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AboutPage } from './pages/AboutPage';
import { ProjectWizardPage } from './pages/ProjectWizardPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Dashboard Core */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<EntrepreneurDashboard />} />
              <Route path="/pathfinder" element={<ApprovalPathfinderPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/queries" element={<QueriesPage />} />
              <Route path="/inspections" element={<InspectionsPage />} />
              <Route path="/inspector-portal" element={<InspectorDashboardPage />} />
              <Route path="/district-dashboard" element={<DistrictAdminDashboardPage />} />
              <Route path="/department-scrutiny" element={<DepartmentDashboardPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/government-support" element={<GovernmentSupportPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/new-project" element={<ProjectWizardPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

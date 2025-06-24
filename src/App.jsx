import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Videos } from './pages/Videos';
import { Chat } from './pages/Chat';
import { Avatars } from './pages/Avatars';
import { Settings } from './pages/Settings';
// Knowledge Transfer Pages
import { KnowledgeTransfer } from './pages/KnowledgeTransfer/KnowledgeTransfer';
import { KnowledgeTransferPackageDetail } from './pages/KnowledgeTransfer/KnowledgeTransferPackageDetail';
import { KnowledgeTransferEnrollmentDetail } from './pages/KnowledgeTransfer/KnowledgeTransferEnrollmentDetail';
import { KnowledgeTransferAssessment } from './pages/KnowledgeTransfer/KnowledgeTransferAssessment';
// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminOrganizations } from './pages/Admin/AdminOrganizations';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminAnalytics } from './pages/Admin/AdminAnalytics';
import { AdminSettings } from './pages/Admin/AdminSettings';
import { OrganizationDetail } from './pages/Admin/OrganizationDetail';
import { UserDetail } from './pages/Admin/UserDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* User Routes */}
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="videos" element={<Videos />} />
            <Route path="chat" element={<Chat />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Knowledge Transfer Routes */}
            <Route path="knowledge-transfer" element={<KnowledgeTransfer />} />
            <Route path="knowledge-transfer/packages/:packageId" element={<KnowledgeTransferPackageDetail />} />
            <Route path="knowledge-transfer/enrollments/:enrollmentId" element={<KnowledgeTransferEnrollmentDetail />} />
            <Route path="knowledge-transfer/assessments/:assessmentId" element={<KnowledgeTransferAssessment />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/organizations" element={<AdminOrganizations />} />
            <Route path="admin/organizations/:organizationId" element={<OrganizationDetail />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/users/:userId" element={<UserDetail />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
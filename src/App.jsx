import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Videos } from './pages/Videos';
import { VideoEditorPage } from './components/Videos/VideoEditorPage';
import { Chat } from './pages/Chat';
import { Avatars } from './pages/Avatars';
import { Settings } from './pages/Settings';
// Knowledge Transfer Pages
import { KnowledgeTransfer } from './pages/KnowledgeTransfer/KnowledgeTransfer';
import { KnowledgeTransferPackageDetail } from './pages/KnowledgeTransfer/KnowledgeTransferPackageDetail';
import { KnowledgeTransferEnrollmentDetail } from './pages/KnowledgeTransfer/KnowledgeTransferEnrollmentDetail';
import { KnowledgeTransferAssessment } from './pages/KnowledgeTransfer/KnowledgeTransferAssessment';
// Admin Pages
import { Organizations } from './pages/Organizations';
import { OrganizationDetail } from './pages/OrganizationDetail';
import { Users } from './pages/Users';
import { UserDetail } from './pages/UserDetail';
import { Analytics } from './pages/Analytics';
// Authentication components
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ProtectedRoute, PublicRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Authentication routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
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
              
              {/* Admin Routes - now accessible via role-based permissions */}
              <Route path="organizations" element={<Organizations />} />
              <Route path="organizations/:organizationId" element={<OrganizationDetail />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            
            {/* Video Editor Page - Full screen outside of main layout */}
            <Route path="videos/editor/:videoId" element={
              <ProtectedRoute>
                <VideoEditorPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
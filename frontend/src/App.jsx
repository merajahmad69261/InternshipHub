import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ResumePage from "./pages/ResumePage";
import SearchPage from "./pages/SearchPage";
import HybridRankingPage from "./pages/HybridRankingPage";
import ResumeExtractionPage from "./pages/ResumeExtractionPage";
import SkillGapPage from "./pages/SkillGapPage";
import LearnPage from "./pages/LearnPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageInternships from "./pages/admin/ManageInternships";
import Reports from "./pages/admin/Reports";
import ManageApplications from "./pages/admin/ManageApplications";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
      <Route path="/learn/:skill" element={<LearnPage />} />
      <Route path="/hybrid-ranking" element={<HybridRankingPage />} />
      <Route path="/resume-extraction" element={<ResumeExtractionPage />} />
      <Route path="/skill-gap" element={<SkillGapPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/internships" element={<ManageInternships />} />
      <Route path="/admin/applications" element={<ManageApplications />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
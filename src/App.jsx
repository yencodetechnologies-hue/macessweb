import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVisitorsPage from './pages/AdminVisitorsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CollegePage from './pages/CollegePage';
import PropertiesPage from './pages/PropertiesPage';
import PlaceholderAdminPage from './pages/PlaceholderAdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/visitors"
        element={
          <ProtectedRoute allowAdmin>
            <AdminVisitorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/college"
        element={
          <ProtectedRoute allowAdmin>
            <CollegePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <ProtectedRoute allowAdmin>
            <PropertiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute allowAdmin>
            <PlaceholderAdminPage
              title="Approvals"
              description="Visitor and user approval workflows — use the mobile app or expand this module next."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute allowAdmin>
            <AdminVisitorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowAdmin>
            <PlaceholderAdminPage
              title="Reports"
              description="Analytics and export reports will appear here."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowAdmin>
            <PlaceholderAdminPage
              title="Settings"
              description="Property settings and feature toggles — manage via admin dashboard modules."
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowUser>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

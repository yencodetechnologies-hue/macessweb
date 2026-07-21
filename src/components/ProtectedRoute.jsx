import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, isAdminRole, isUserRole } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowAdmin, allowUser }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loader">
        <p>Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const type = user.userType;

  if (allowAdmin && isAdminRole(type)) {
    return children;
  }

  if (allowUser && isUserRole(type)) {
    return children;
  }

  if (allowAdmin && allowUser) {
    return children;
  }

  if (isAdminRole(type)) {
    return <Navigate to="/admin" replace />;
  }

  if (isUserRole(type)) {
    return <Navigate to="/user" replace />;
  }

  return <Navigate to="/login" replace />;
}

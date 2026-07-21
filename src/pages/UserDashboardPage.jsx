import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="user-shell">
      <header className="user-topbar">
        <div className="user-brand">
          <img src="/logo.png" alt="" width={32} height={32} />
          <span>M Access</span>
        </div>
        <div className="user-profile">
          <strong>{user?.name}</strong>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="user-main card">
        <h1>Welcome, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="user-lead">
          Your resident dashboard — approve visitors, view notices, and manage daily access from
          the mobile app or web.
        </p>
        <div className="user-quick">
          <div className="user-quick-card">
            <strong>Property</strong>
            <span>{user?.block ? `Block ${user.block}` : 'Connected'}</span>
          </div>
          <div className="user-quick-card">
            <strong>Status</strong>
            <span>{user?.status || 'approved'}</span>
          </div>
        </div>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </main>
    </div>
  );
}

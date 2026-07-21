import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/visitors', label: 'Live Visitors', icon: '👥' },
  { to: '/admin/college', label: 'College', icon: '🎓' },
  { to: '/admin/properties', label: 'Properties', icon: '🏢' },
  { to: '/admin/approvals', label: 'Approvals', icon: '📝' },
  { to: '/admin/history', label: 'Visit History', icon: '🕐' },
  { to: '/admin/reports', label: 'Reports', icon: '📊' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="M Access" width={36} height={36} />
          <span>M Access</span>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              <span className="admin-nav-icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-profile">
            <div className="admin-avatar">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-profile-meta">
              <strong>{user?.name || 'Admin'}</strong>
              <span>{user?.userType === 'apartment' ? 'Management' : 'Admin'}</span>
            </div>
            <button type="button" className="btn btn-outline admin-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

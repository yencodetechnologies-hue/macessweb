import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, isAdminRole, isUserRole } from '../context/AuthContext';
import './LoginPage.css';

const ROLES = [
  { id: 'apartment', label: 'Management', hint: 'Mobile + password' },
  { id: 'user', label: 'User / Tenant', hint: 'Email or mobile + password' },
];

export default function LoginPage() {
  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  const [role, setRole] = useState('apartment');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && isAuthenticated && user) {
    if (isAdminRole(user.userType)) return <Navigate to="/admin" replace />;
    if (isUserRole(user.userType)) return <Navigate to="/user" replace />;
  }

  const identifierLabel = role === 'apartment' ? 'Mobile number' : 'Email or mobile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedIn = await login({ identifier, password, userType: role });
      if (loggedIn?.status === 'pending') {
        setError('Your account is pending approval.');
        return;
      }
      if (isAdminRole(loggedIn.userType)) {
        navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
      } else if (isUserRole(loggedIn.userType)) {
        navigate('/user', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-brand">
          <img src="/logo.png" alt="M Access" width={72} height={72} />
          <h1>M Access</h1>
          <p>Welcome back — sign in to your dashboard</p>
        </div>

        <div className="role-tabs">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`role-tab${role === r.id ? ' active' : ''}`}
              onClick={() => setRole(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="role-hint">{ROLES.find((r) => r.id === role)?.hint}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="identifier">{identifierLabel}</label>
            <input
              id="identifier"
              type={role === 'apartment' ? 'tel' : 'text'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              placeholder={
                role === 'apartment' ? '10-digit mobile' : 'you@example.com or mobile'
              }
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <p className="field-error login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

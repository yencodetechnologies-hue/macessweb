import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  createApartment,
  createCompanyPublic,
  listApartments,
} from '../api/apartments';
import { useAuth } from '../context/AuthContext';
import { setSelectedApartmentId } from '../api/client';
import './CollegePage.css';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function emptyForm() {
  return {
    name: '',
    address: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  };
}

export default function CollegePage() {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'admin';
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listApartments();
      const all = res.apartments || [];
      setColleges(all.filter((a) => a.propertyType === 'company'));
    } catch (e) {
      setMessage(e.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'College name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.mobile.trim()) next.mobile = 'Mobile number is required';
    else if (form.mobile.trim().length !== 10) next.mobile = 'Mobile must be 10 digits';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        email: form.email.trim().toLowerCase(),
        contactPhone: form.mobile.trim(),
        password: form.password,
        propertyType: 'company',
      };

      if (isAdmin) {
        await createApartment(payload);
      } else {
        await createCompanyPublic(payload);
      }

      setForm(emptyForm());
      setMessage('College created successfully.');
      await loadColleges();
    } catch (err) {
      setMessage(err.message || 'Failed to create college');
    } finally {
      setSubmitting(false);
    }
  };

  const selectCollege = (id) => {
    setSelectedApartmentId(id);
    setMessage('Selected college for property management.');
  };

  return (
    <AdminLayout title="College">
      <div className="college-page">
        <div className="college-grid">
          <section className="card college-form-section">
            <h2>Create College</h2>
            <p className="section-lead">
              Register a company/college with management login credentials.
            </p>
            <form onSubmit={handleSubmit} className="college-form">
              <div className="field">
                <label htmlFor="name">College name</label>
                <input id="name" value={form.name} onChange={handleChange('name')} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="address">Address</label>
                <textarea id="address" rows={2} value={form.address} onChange={handleChange('address')} />
              </div>
              <div className="field">
                <label htmlFor="email">Email ID</label>
                <input id="email" type="email" value={form.email} onChange={handleChange('email')} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="mobile">Mobile number</label>
                <input id="mobile" inputMode="numeric" maxLength={10} value={form.mobile} onChange={handleChange('mobile')} />
                {errors.mobile && <span className="field-error">{errors.mobile}</span>}
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" value={form.password} onChange={handleChange('password')} />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <div className="field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <span className="field-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
              {message && (
                <p className={`form-message${message.includes('success') ? ' ok' : ''}`}>{message}</p>
              )}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create College'}
              </button>
            </form>
          </section>

          <section className="card college-list-section">
            <h2>Colleges</h2>
            {loading ? (
              <p className="muted">Loading…</p>
            ) : colleges.length === 0 ? (
              <p className="muted">No colleges yet. Create one to get started.</p>
            ) : (
              <ul className="college-list">
                {colleges.map((c) => (
                  <li key={c.id || c._id} className="college-list-item">
                    <div>
                      <strong>{c.name}</strong>
                      <span>{c.email || '—'} · {c.contactPhone || '—'}</span>
                      {c.address && <small>{c.address}</small>}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => selectCollege(c.id || c._id)}>
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

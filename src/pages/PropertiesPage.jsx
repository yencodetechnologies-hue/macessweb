import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { createBlock, listBlocks } from '../api/blocks';
import {
  createApartment,
  createCompanyPublic,
  listApartments,
} from '../api/apartments';
import { getSelectedApartmentId, setSelectedApartmentId } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './PropertiesPage.css';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function PropertiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'admin';

  const [colleges, setColleges] = useState([]);
  const [selectedId, setSelectedId] = useState(getSelectedApartmentId() || '');
  const [blocks, setBlocks] = useState([]);
  const [blockName, setBlockName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showCreateCollege, setShowCreateCollege] = useState(false);
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    address: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const loadColleges = useCallback(async () => {
    const res = await listApartments();
    const companies = (res.apartments || []).filter((a) => a.propertyType === 'company');
    setColleges(companies);
    if (!selectedId && companies.length > 0) {
      const first = companies[0].id || companies[0]._id;
      setSelectedId(first);
      setSelectedApartmentId(first);
    }
  }, [selectedId]);

  const loadBlocks = useCallback(async (apartmentId) => {
    if (!apartmentId) {
      setBlocks([]);
      return;
    }
    const res = await listBlocks(apartmentId);
    setBlocks(res.blocks || []);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadColleges();
      } catch (e) {
        setMessage(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadColleges]);

  useEffect(() => {
    if (selectedId) loadBlocks(selectedId);
  }, [selectedId, loadBlocks]);

  const handleSelectCollege = (id) => {
    setSelectedId(id);
    setSelectedApartmentId(id);
  };

  const validateCollegeForm = () => {
    if (!collegeForm.name.trim()) return 'College name is required';
    if (!collegeForm.email.trim() || !EMAIL_RE.test(collegeForm.email.trim())) {
      return 'Valid email is required';
    }
    if (collegeForm.mobile.trim().length !== 10) return 'Mobile must be 10 digits';
    if (collegeForm.password.length < 6) return 'Password min 6 characters';
    if (collegeForm.password !== collegeForm.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const createCollegeIfNeeded = async () => {
    if (selectedId) return selectedId;

    const err = validateCollegeForm();
    if (err) throw new Error(err);

    const payload = {
      name: collegeForm.name.trim(),
      address: collegeForm.address.trim(),
      email: collegeForm.email.trim().toLowerCase(),
      contactPhone: collegeForm.mobile.trim(),
      password: collegeForm.password,
      propertyType: 'company',
    };

    const res = isAdmin
      ? await createApartment(payload)
      : await createCompanyPublic(payload);

    const apt = res.apartment;
    const id = apt?.id || apt?._id;
    if (!id) throw new Error('College created but ID missing');
    setSelectedId(id);
    setSelectedApartmentId(id);
    await loadColleges();
    return id;
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      let apartmentId = selectedId;
      if (!apartmentId) {
        apartmentId = await createCollegeIfNeeded();
      }
      if (!blockName.trim()) {
        setMessage('Property / block name is required');
        return;
      }
      await createBlock({ name: blockName.trim(), apartmentId });
      setBlockName('');
      setMessage('Property block created successfully.');
      await loadBlocks(apartmentId);
    } catch (err) {
      setMessage(err.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Properties">
      <div className="properties-page">
        <section className="card properties-section">
          <h2>Property under College</h2>
          <p className="section-lead">
            Select a college, or create one inline, then add blocks (buildings) as properties.
          </p>

          {loading ? (
            <p className="muted">Loading…</p>
          ) : (
            <>
              <div className="field">
                <label htmlFor="collegeSelect">College</label>
                <select
                  id="collegeSelect"
                  value={selectedId}
                  onChange={(e) => handleSelectCollege(e.target.value)}
                >
                  <option value="">— Create new college below —</option>
                  {colleges.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedId && (
                <div className="inline-college card">
                  <div className="inline-college-head">
                    <h3>New college (auto-create)</h3>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowCreateCollege((v) => !v)}
                    >
                      {showCreateCollege ? 'Hide' : 'Show form'}
                    </button>
                  </div>
                  {showCreateCollege && (
                    <div className="inline-college-fields">
                      <div className="field">
                        <label>College name</label>
                        <input
                          value={collegeForm.name}
                          onChange={(e) =>
                            setCollegeForm((f) => ({ ...f, name: e.target.value }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Address</label>
                        <input
                          value={collegeForm.address}
                          onChange={(e) =>
                            setCollegeForm((f) => ({ ...f, address: e.target.value }))
                          }
                        />
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label>Email</label>
                          <input
                            type="email"
                            value={collegeForm.email}
                            onChange={(e) =>
                              setCollegeForm((f) => ({ ...f, email: e.target.value }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label>Mobile</label>
                          <input
                            maxLength={10}
                            value={collegeForm.mobile}
                            onChange={(e) =>
                              setCollegeForm((f) => ({ ...f, mobile: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label>Password</label>
                          <input
                            type="password"
                            value={collegeForm.password}
                            onChange={(e) =>
                              setCollegeForm((f) => ({ ...f, password: e.target.value }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label>Confirm password</label>
                          <input
                            type="password"
                            value={collegeForm.confirmPassword}
                            onChange={(e) =>
                              setCollegeForm((f) => ({
                                ...f,
                                confirmPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleCreateBlock} className="block-form">
                <div className="field">
                  <label htmlFor="blockName">Property / Block name</label>
                  <input
                    id="blockName"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    placeholder="e.g. Block A, Main Building"
                  />
                </div>
                {message && (
                  <p className={`form-message${message.includes('success') ? ' ok' : ''}`}>
                    {message}
                  </p>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Create Property'}
                </button>
              </form>
            </>
          )}
        </section>

        <section className="card properties-list-section">
          <h2>Blocks in selected college</h2>
          {blocks.length === 0 ? (
            <p className="muted">No properties yet.</p>
          ) : (
            <ul className="block-list">
              {blocks.map((b) => (
                <li key={b.id || b._id}>
                  <strong>{b.name}</strong>
                  <span>{(b.floors || []).length} floor(s)</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

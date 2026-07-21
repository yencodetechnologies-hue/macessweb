import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getActiveVisitors,
  getVisitorAnalytics,
  getVisitorHistory,
} from '../api/visitors';
import { getSelectedApartmentId } from '../api/client';
import './VisitorsPanel.css';

function formatTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function statusLabel(v) {
  if (v.visitStatus === 'entered' || v.status === 'entered') return 'Checked-in';
  if (v.visitStatus === 'exited' || v.status === 'exited') return 'Checked-out';
  if (v.visitStatus === 'pendingApproval') return 'Pending';
  if (v.visitStatus === 'approved') return 'Approved';
  return v.statusLabel || v.status || '—';
}

function isCheckedIn(v) {
  const s = (v.visitStatus || v.status || '').toLowerCase();
  return s === 'entered' || s === 'checked-in' || s === 'checked_in';
}

export default function VisitorsPanel({ apartmentId: propApartmentId, compact = false }) {
  const apartmentId = propApartmentId || getSelectedApartmentId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [historyVisitors, setHistoryVisitors] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [activeRes, historyRes, analyticsRes] = await Promise.all([
          getActiveVisitors(apartmentId),
          getVisitorHistory(apartmentId),
          getVisitorAnalytics(apartmentId),
        ]);

        if (cancelled) return;

        setActiveVisitors(activeRes.visitors || []);
        setHistoryVisitors(historyRes.visitors || []);
        setAnalytics(analyticsRes.analytics || {});
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load visitors');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apartmentId]);

  const stats = useMemo(() => {
    const today = analytics.visitorsToday ?? historyVisitors.length;
    const inside = analytics.currentlyInside ?? activeVisitors.length;
    const checkedIn = activeVisitors.filter(isCheckedIn).length;
    const checkedOut = Math.max(0, (today || 0) - checkedIn);
    const pending =
      analytics.pendingApproval ??
      activeVisitors.filter((v) => statusLabel(v) === 'Pending').length;

    return {
      today: today ?? 0,
      checkedIn: checkedIn || inside,
      checkedOut,
      pending: pending ?? 0,
    };
  }, [activeVisitors, historyVisitors, analytics]);

  const liveRows = useMemo(() => {
    return activeVisitors.slice(0, compact ? 4 : 20).map((v) => ({
      id: v.id || v._id,
      name: v.name || 'Visitor',
      meeting: v.hostName || v.residentName || v.homeNumber || v.block || '—',
      inTime: formatTime(v.enteredAt || v.visitTime),
      status: statusLabel(v),
      checkedIn: isCheckedIn(v),
    }));
  }, [activeVisitors, compact]);

  if (loading) {
    return <div className="visitors-panel loading">Loading visitor data…</div>;
  }

  return (
    <div className="visitors-panel">
      {error && <div className="visitors-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Today&apos;s Visitors</span>
          <strong className="stat-value navy">{stats.today}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Checked-In</span>
          <strong className="stat-value green">{stats.checkedIn}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Checked-Out</span>
          <strong className="stat-value navy">{stats.checkedOut}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Approval</span>
          <strong className="stat-value navy">{String(stats.pending).padStart(2, '0')}</strong>
        </div>
      </div>

      <div className="live-visitors card">
        <div className="live-visitors-head">
          <h2>Live Visitors</h2>
          {!compact && (
            <Link to="/admin/visitors" className="btn btn-primary view-all">
              View All
            </Link>
          )}
        </div>
        <div className="visitors-table-wrap">
          <table className="visitors-table">
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Meeting Person</th>
                <th>In Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-row">
                    No live visitors right now.
                  </td>
                </tr>
              ) : (
                liveRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.meeting}</td>
                    <td>{row.inTime}</td>
                    <td>
                      <span className={`status-pill${row.checkedIn ? ' in' : ''}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {compact && (
          <div className="live-visitors-foot">
            <Link to="/admin/visitors" className="btn btn-primary view-all">
              View All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

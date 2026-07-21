import AdminLayout from '../components/AdminLayout';

export default function PlaceholderAdminPage({ title, description }) {
  return (
    <AdminLayout title={title}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--muted)' }}>{description}</p>
      </div>
    </AdminLayout>
  );
}

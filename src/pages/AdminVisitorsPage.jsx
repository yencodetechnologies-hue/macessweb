import AdminLayout from '../components/AdminLayout';
import VisitorsPanel from '../components/VisitorsPanel';
import { useAuth } from '../context/AuthContext';
import { getSelectedApartmentId } from '../api/client';

export default function AdminVisitorsPage() {
  const { user } = useAuth();
  const apartmentId = getSelectedApartmentId() || user?.apartmentId;

  return (
    <AdminLayout title="Live Visitors">
      <VisitorsPanel apartmentId={apartmentId} />
    </AdminLayout>
  );
}

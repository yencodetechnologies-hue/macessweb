import AdminLayout from '../components/AdminLayout';
import VisitorsPanel from '../components/VisitorsPanel';
import { useAuth } from '../context/AuthContext';
import { getSelectedApartmentId, setSelectedApartmentId } from '../api/client';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const apartmentId = getSelectedApartmentId() || user?.apartmentId;

  if (user?.apartmentId && !getSelectedApartmentId()) {
    setSelectedApartmentId(user.apartmentId);
  }

  return (
    <AdminLayout title="Dashboard">
      <VisitorsPanel apartmentId={apartmentId} compact />
    </AdminLayout>
  );
}

import ProtectedRoute from '@/components/ProtectedRoute';

const AdminPage = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>
        <h1>Admin Page</h1>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;

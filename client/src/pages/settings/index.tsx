import ProtectedRoute from '@/components/ProtectedRoute';

const SettingsPage = () => {
  return (
    <ProtectedRoute authenticationRequired={true}>
      <div>
        <h1>Settings Page</h1>
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;

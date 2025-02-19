import ProtectedRoute from '@/components/ProtectedRoute';

const ProfilePage = () => {
  return (
    <ProtectedRoute authenticationRequired={true}>
      <div>
        <h1>Profile Page</h1>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

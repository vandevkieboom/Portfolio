import ProtectedRoute from '@/components/ProtectedRoute';
import { useGetCurrentUser } from '@/hooks/useAuth';

const ProfilePage = () => {
  const { data: user } = useGetCurrentUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Profile</h2>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full text-center">
              <div className="text-xl font-medium text-[red]">Username</div>
              <p className="mt-2 text-lg text-gray-900">{user?.username}</p>
            </div>
            <div className="w-full text-center">
              <div className="text-xl font-medium text-[red]">Role</div>
              <p className="mt-2 text-lg text-gray-900">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

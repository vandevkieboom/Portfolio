import ProtectedRoute from '@/components/ProtectedRoute';
import { useGetUsers } from '@/hooks/useAuth';

const AdminPage = () => {
  const { data: users } = useGetUsers();

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-gray-800">Admin Panel</h1>
            <h2 className="mt-2 text-xl text-gray-600">All Users</h2>
          </div>

          <div className="space-y-6">
            {users?.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-md p-6 space-y-4 hover:bg-gray-50 transition duration-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-[red]">Id</div>
                    <p className="mt-1 text-gray-800">{user.id}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[red]">Role</div>
                    <p className="mt-1 text-gray-800">{user.role}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[red]">Username</div>
                    <p className="mt-1 text-gray-800">{user.username}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[red]">Created At</div>
                    <p className="mt-1 text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[red]">Password</div>
                    <p className="mt-1 text-gray-800">{user.password}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;

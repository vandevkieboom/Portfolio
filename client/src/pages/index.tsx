import ProtectedRoute from '@/components/ProtectedRoute';
import { useGetCurrentUser, useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const Home = () => {
  const { mutate: logout, isPending } = useLogout();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800">Home Page</h1>
      <div className="space-y-4">
        <button
          onClick={() => router.push('/profile')}
          className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          Go to Profile
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
        >
          Go to Admin
        </button>

        <button
          onClick={() => router.push('/blog')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          View Blogs
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            disabled={isPending}
          >
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        )}

        {!user && (
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

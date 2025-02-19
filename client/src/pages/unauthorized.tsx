import { useRouter } from 'next/router';

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center flex-col p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 rounded-md shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access this page.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

import { useRouter } from 'next/router';

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <p style={{ color: 'red', fontSize: '20px', padding: '0.5rem' }}>
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
      >
        Return to Home
      </button>
    </div>
  );
};

export default UnauthorizedPage;

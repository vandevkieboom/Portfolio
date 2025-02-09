// In ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useGetCurrentUser } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  authenticationRequired?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, authenticationRequired = true }: ProtectedRouteProps) => {
  const router = useRouter();
  const { data: user, error, isLoading } = useGetCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (authenticationRequired) {
      if (!user && !isLoading) {
        router.push('/unauthorized');
        return;
      }

      if (user && requireAdmin && user.role !== 'ADMIN') {
        router.push('/unauthorized');
      }
    } else {
      if (user) {
        router.replace('/');
      }
    }
  }, [mounted, user, requireAdmin, authenticationRequired, router, isLoading]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  if (authenticationRequired) {
    if (!user || (requireAdmin && user.role !== 'ADMIN')) {
      return null;
    }
    return <>{children}</>;
  }

  if (!authenticationRequired) {
    if (user) {
      return null;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

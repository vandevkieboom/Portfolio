import { useRouter } from 'next/router';
import { useGetCurrentUser } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const router = useRouter();
  const { data: user, error } = useGetCurrentUser();

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!user || (requireAdmin && user?.role !== 'ADMIN')) {
    router.push('/unauthorized');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

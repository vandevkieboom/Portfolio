import React from 'react';
import { useLogout } from '@/hooks/useAuth';

const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout} disabled={isPending} className="bg-red-500 text-white p-2 rounded">
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;

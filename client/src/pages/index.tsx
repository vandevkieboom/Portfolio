import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const userId: number = 1;

  const fetchUserData = async () => {
    const token = Cookies.get('token');
    console.log('Token:', token);

    try {
      const res = await fetch(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        if (res.status === 403) {
          throw new Error('User requires admin rights');
        }
        if (res.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Something went wrong');
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User</h1>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <p>Password: {user.password}</p>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const userId: number = 1;

  const fetchUserData = () => {
    fetch(`http://localhost:8080/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('User not found');
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
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

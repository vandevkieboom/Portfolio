import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGetCurrentUser, useLogout } from '@/hooks/useAuth';
import { FaFileDownload, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { data: user } = useGetCurrentUser();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if (isDark) document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', newMode.toString());
        document.body.classList.toggle('dark', newMode);
      }
      return newMode;
    });
  };

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <nav className="fixed w-full backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div onClick={() => router.push('/')} className="text-xl font-medium dark:text-white cursor-pointer">
            vandevkieboom
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleDarkMode}
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            {['/', '/Blog', '/Skills', '/Internship'].map((path) => (
              <button
                key={path}
                onClick={() => router.push(path.toLocaleLowerCase())}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath(path) ? 'text-black dark:text-white' : ''
                }`}
              >
                {path.substring(1) || 'Home'}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => router.push('/login')}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath('/login') ? 'text-black dark:text-white' : ''
                }`}
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => logout()}
                disabled={isPending}
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>

          <div className="flex items-center md:hidden gap-7">
            <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-400">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 dark:text-gray-400">
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 pb-4">
            {['/', '/Blog', '/Skills', '/Internship'].map((path) => (
              <button
                key={path}
                onClick={() => {
                  router.push(path.toLocaleLowerCase());
                  setMenuOpen(false);
                }}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath(path) ? 'text-black dark:text-white' : ''
                }`}
              >
                {path.substring(1) || 'Home'}
              </button>
            ))}
            s
            {!user ? (
              <button
                onClick={() => {
                  router.push('/login');
                  setMenuOpen(false);
                }}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath('/login') ? 'text-black dark:text-white' : ''
                }`}
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                disabled={isPending}
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="pt-20">{children}</main>
    </div>
  );
};

export default Layout;

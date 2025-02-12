import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGetCurrentUser, useLogout } from '@/hooks/useAuth';
import { FaFileDownload, FaMoon, FaSun } from 'react-icons/fa';

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { data: user } = useGetCurrentUser();
  const [darkMode, setDarkMode] = useState(false);

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

  const handleDownloadResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <nav className="fixed w-full backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div onClick={() => router.push('/')} className="text-xl font-medium dark:text-white cursor-pointer">
              vandevkieboom
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
              <button
                onClick={() => router.push('/')}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath('/') ? 'text-black dark:text-white' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => router.push('/blog')}
                className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${
                  isActivePath('/blog') || router.pathname.startsWith('/blog/') ? 'text-black dark:text-white' : ''
                }`}
              >
                Blog
              </button>
              <button
                onClick={handleDownloadResume}
                className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:text-white transition-all"
              >
                <FaFileDownload />
                Resume
              </button>
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
          </div>
        </div>
      </nav>
      <main className="pt-20">{children}</main>
    </div>
  );
};

export default Layout;

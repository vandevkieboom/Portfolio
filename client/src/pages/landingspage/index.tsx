import React from 'react';
import { useRouter } from 'next/router';
import { useGetBlogs, useGetCurrentUser, useLogout } from '@/hooks/useAuth';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { FaCalendar } from 'react-icons/fa';
import { IoMdBriefcase } from 'react-icons/io';
import { FaLocationDot } from 'react-icons/fa6';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

const LandingPage = () => {
  const router = useRouter();
  const { data: blogs = [] } = useGetBlogs();
  const latestBlog = blogs[0];
  const { mutate: logout, isPending } = useLogout();
  const { data: user } = useGetCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-200 text-black">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold mb-6">portfolio</h1>
          <p className="text-xl mb-8">info</p>
          <button
            onClick={() => router.push('/blog')}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-red-400 transition-colors"
          >
            Read My Blog Posts
          </button>

          {user && (
            <button
              onClick={() => router.push('/login')}
              className="mx-4 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-red-400 transition-colors"
            >
              Login
            </button>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="mx-4 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-red-400 transition-colors"
              disabled={isPending}
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </div>

      {latestBlog && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Latest Blog Post</h2>
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 text-black mb-4">
              <FaCalendar size={20} />
              <span>{new Date(latestBlog.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">{latestBlog.title}</h3>
            <p className="text-gray-600 mb-6">{latestBlog.content.substring(0, 300)}...</p>
            <button
              onClick={() => router.push(`/blog/${latestBlog.id}`)}
              className="text-red-400 font-medium hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <FaLongArrowAltRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/me.png" alt="Profile" className="rounded-full shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              <p className="text-black mb-6">
                As a child, I was always particularly interested in creating websites, video games, and apps. After some
                self-study and experimentation, I decided to participate in a bootcamp at BeCode, where I got a taste of
                this fascinating world. Unfortunately, BeCode in Antwerp was closed due to financial circumstances.
                Following that, I decided to continue my education and enrolled in the Programming Graduation Program at
                the AP University College Antwerp.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <IoMdBriefcase size={20} />
                  <span>Intern Junior Developer @Tactics</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaLocationDot size={20} />
                  <span>Antwerp, Belgium</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://linkedin.com/in/vandevkieboom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-2 rounded-full text-white"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a
                  href="https://github.com/vandevkieboom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-2 rounded-full text-white"
                >
                  <FaGithub size={20} />
                </a>
                <a href="mailto:vandevkieboom@gmail.com" className="bg-black p-2 rounded-full text-white">
                  <IoMdMail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">About My Internship</h2>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold mb-4">Tactics</h3>
          <p className="text-gray-600 mb-6"></p>
          <div className="space-y-4">
            <h4 className="font-semibold">Lorem Ipsum:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

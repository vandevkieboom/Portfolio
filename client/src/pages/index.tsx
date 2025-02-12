import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetBlogs, useGetCurrentUser, useLogout } from '@/hooks/useAuth';
import { FaLongArrowAltRight, FaCalendar, FaLinkedinIn, FaGithub, FaFileDownload, FaMoon, FaSun } from 'react-icons/fa';
import { IoMdBriefcase, IoMdMail } from 'react-icons/io';
import { FaLocationDot } from 'react-icons/fa6';

const LatestBlogSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-2 mb-6">
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const LandingPage = () => {
  const router = useRouter();
  const { data: blogs = [], isLoading } = useGetBlogs();
  const latestBlog = blogs[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-7xl font-bold mb-8 dark:text-white">
            Hello, I'm
            <br />
            Jordy Van Den Kieboom
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Junior Developer with a passion for creating elegant, functional web applications. Currently interning at
            Tactics in Antwerp.
          </p>
        </div>
      </section>

      {/* Latest Blog Post */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 dark:text-white">Latest Thoughts</h2>
          {isLoading ? (
            <LatestBlogSkeleton />
          ) : latestBlog ? (
            <div
              className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => router.push(`/blog/${latestBlog.id}`)}
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                <FaCalendar size={16} />
                <span>{new Date(latestBlog.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-medium mb-4 dark:text-white">{latestBlog.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{latestBlog.content.substring(0, 300)}...</p>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white group">
                Read more
                <FaLongArrowAltRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No blog posts yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/me.png"
                alt="Profile"
                className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-full shadow-md"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-6 dark:text-white">About Me</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                As a child, I was always particularly interested in creating websites, video games, and apps. After some
                self-study and experimentation, I decided to participate in a bootcamp at BeCode, where I got a taste of
                this fascinating world. Unfortunately, BeCode in Antwerp was closed due to financial circumstances.
                Following that, I decided to continue my education and enrolled in the Programming Graduation Program at
                the AP University College Antwerp.
              </p>

              <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <IoMdBriefcase size={20} />
                  <span>Intern Junior Developer @Tactics</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaLocationDot size={20} />
                  <span>Antwerp, Belgium</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/vandevkieboom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a
                  href="https://github.com/vandevkieboom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="mailto:vandevkieboom@gmail.com"
                  className="p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
                >
                  <IoMdMail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetBlogs } from '@/hooks/useAuth';
import { FaLongArrowAltRight, FaCalendar, FaFileDownload } from 'react-icons/fa';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
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
  const latestBlogs = blogs.slice(0, 1);

  const handleDownloadResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-7xl font-bold mb-8 dark:text-white">
            Hello, I'm
            <br />
            Jordy Van Den Kieboom
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Junior Developer with a passion for creating elegant, functional web applications. Currently interning at
            Tactics in Antwerp.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 dark:text-white">Latest Blog</h2>
          {isLoading ? (
            <LatestBlogSkeleton />
          ) : latestBlogs.length > 0 ? (
            <div className="space-y-8">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blog/${blog.id}`)}
                >
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                    <FaCalendar size={16} />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-4 dark:text-white">{blog.title}</h3>
                  <p
                    className="text-gray-600 dark:text-gray-400 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content,
                    }}
                  />
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white group">
                    Read more
                    <FaLongArrowAltRight className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No blog posts yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
                As a child, I was always particularly interested in developing websites, and video games, After some
                self-study and experimentation, I decided to participate in a bootcamp at BeCode, where I got a taste of
                this fascinating world. Unfortunately, BeCode in Antwerp was closed due to financial circumstances.
                Following that, I decided to continue my education and enrolled in the Programming Graduation Program at
                AP University College Antwerp.
              </p>
              <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <IoMdBriefcase size={20} />
                  <span>Junior Full-Stack Developer</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaLocationDot size={20} />
                  <span>Antwerp, Belgium</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <p className="text-black mb-2 dark:text-white">socials</p>
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

                <div>
                  <p className="text-black mb-2 dark:text-white">curriculum vitae</p>
                  <button
                    onClick={handleDownloadResume}
                    className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
                  >
                    <FaFileDownload size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

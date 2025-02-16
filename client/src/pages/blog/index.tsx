import { useGetBlogs, useGetCurrentUser } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { FaCalendar, FaLongArrowAltRight } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';

const BlogSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const BlogsPage = () => {
  const { data: blogs = [], isLoading } = useGetBlogs();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold dark:text-white">Blog Posts</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => router.push('/blog/create')}
            className="mt-4 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
          >
            <IoMdCreate size={20} />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {isLoading
          ? Array(3)
              .fill(null)
              .map((_, index) => <BlogSkeleton key={index} />)
          : blogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => router.push(`/blog/${blog.id}`)}
                className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                  <FaCalendar size={16} />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{blog.title}</h2>
                <p
                  className="text-gray-600 dark:text-gray-400 mb-6"
                  dangerouslySetInnerHTML={{
                    __html: blog.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content,
                  }}
                />
                <div className="flex items-center gap-2 text-black dark:text-white group">
                  Read more
                  <FaLongArrowAltRight className="group-hover:translate-x-2 transition-transform" />
                </div>
              </article>
            ))}
      </div>
    </div>
  );
};

export default BlogsPage;

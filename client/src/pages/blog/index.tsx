import { useGetBlogs } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useGetCurrentUser } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

const BlogsPage = () => {
  const { data: blogs, isLoading } = useGetBlogs();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => router.push('/blog/create')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create New Post
            </button>
          )}
        </div>

        <div className="space-y-8">
          {blogs?.map((blog) => (
            <article key={blog.id} className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
              <div className="text-sm text-gray-500 mb-4">
                By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">
                {blog.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;

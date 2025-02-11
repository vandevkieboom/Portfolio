import { useGetBlogs } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useGetCurrentUser } from '@/hooks/useAuth';

const BlogSkeleton = () => (
  <article className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
  </article>
);

const BlogsPage = () => {
  const { data: blogs = [], isLoading } = useGetBlogs();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();

  const skeletonCount = isLoading ? 2 : blogs.length;

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
          {isLoading
            ? Array(skeletonCount)
                .fill(null)
                .map((_, index) => <BlogSkeleton key={index} />)
            : blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/blog/${blog.id}`)}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
                  <div className="text-sm text-gray-500 mb-4">
                    By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {blog.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content}
                  </p>
                  <div className="mt-4">
                    <span className="text-blue-500 hover:text-blue-600 transition-colors">Read more →</span>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;

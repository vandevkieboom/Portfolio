import { useRouter } from 'next/router';
import { useGetBlogById } from '@/hooks/useAuth';

const BlogDetailSkeleton = () => (
  <article className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded mb-6 w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </article>
);

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading } = useGetBlogById(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BlogDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/blog')}
          className="mb-6 text-blue-500 hover:text-blue-600 transition-colors"
        >
          ← Back to blogs
        </button>

        <article className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h1>
          <div className="text-sm text-gray-500 mb-6">
            By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">{blog.content}</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;

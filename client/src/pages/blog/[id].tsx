import { useRouter } from 'next/router';
import { useGetBlogById } from '@/hooks/useAuth';
import { FaArrowLeft } from 'react-icons/fa';

const BlogDetailSkeleton = () => (
  <article className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </article>
);

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading } = useGetBlogById(id as string);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BlogDetailSkeleton />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold dark:text-white">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push('/blog')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors"
      >
        <FaArrowLeft size={16} />
        Back to blogs
      </button>

      <article className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
        </div>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetailPage;

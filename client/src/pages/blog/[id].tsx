import { useRouter } from 'next/router';
import { useGetBlogById } from '@/hooks/useAuth';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa';
import { useEffect } from 'react';
import CommentSection from '@/components/CommentSection';

// Helper function to create URL-friendly slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const BlogDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
    <div className="mb-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-8"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading } = useGetBlogById(id as string);

  // Update URL when blog data is loaded
  useEffect(() => {
    if (blog) {
      const slug = createSlug(blog.title);
      // Replace URL without reloading the page
      window.history.replaceState(null, '', `/blog/${slug}`);
    }
  }, [blog]);

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold dark:text-white">Blog not found</h1>
      </div>
    );
  }

  return (
    <article className="max-w-6xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push('/blog')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to blogs
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-8">
          <FaCalendar size={16} />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>By {blog.author.username}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Blog Content */}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
        <CommentSection blogId={id as string} />
      </div>
    </article>
  );
};

export default BlogDetailPage;

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateBlog } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const CreateBlogPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createBlogMutation = useCreateBlog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlogMutation.mutateAsync({ title, content });
      router.push('/blog');
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBlogMutation.isPending}
              className="px-4 py-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50"
            >
              {createBlogMutation.isPending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CreateBlogPage;

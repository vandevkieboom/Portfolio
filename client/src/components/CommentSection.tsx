import React, { useState } from 'react';
import { useGetComments, useCreateComment, useDeleteComment, useGetCurrentUser } from '@/hooks/useAuth';
import CommentComponent from './Comment';
import { BlogComment } from '@/api/api';
import Link from 'next/link';

interface CommentSectionProps {
  blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const [newComment, setNewComment] = useState('');
  const { data: comments = [], isLoading: isLoadingComments } = useGetComments(blogId);
  const createCommentMutation = useCreateComment(blogId);
  const deleteCommentMutation = useDeleteComment(blogId);
  const { data: currentUser } = useGetCurrentUser();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({ content: newComment.trim() });
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (isLoadingComments) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 dark:text-white">Comments</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-8 dark:text-white">Comments</h2>

        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 dark:text-white"
              rows={3}
            />
            <button
              type="submit"
              disabled={createCommentMutation.isPending || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-all disabled:opacity-50"
            >
              {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Please{' '}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                log in
              </Link>{' '}
              to post a comment.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment: BlogComment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <CommentComponent comment={comment} onDelete={handleDeleteComment} />
            </div>
          ))}
          {comments.length === 0 && (
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;

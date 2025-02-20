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
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Please{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            log in
          </Link>{' '}
          to post a comment.
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment: BlogComment) => (
          <CommentComponent key={comment.id} comment={comment} onDelete={handleDeleteComment} />
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

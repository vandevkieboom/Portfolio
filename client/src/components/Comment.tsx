import React, { useState } from 'react';
import { BlogComment } from '@/api/api';
import { useGetCurrentUser } from '@/hooks/useAuth';

interface CommentProps {
  comment: BlogComment;
  onDelete: (commentId: string) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ comment, onDelete }) => {
  const { data: currentUser } = useGetCurrentUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id.toString());
      } catch (error) {
        console.error('Failed to delete comment:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {comment.author.avatarUrl && (
            <img src={comment.author.avatarUrl} alt={comment.author.username} className="w-8 h-8 rounded-full" />
          )}
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{comment.author.username}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {(currentUser?.id === comment.authorId || currentUser?.role === 'ADMIN') && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export default CommentComponent;

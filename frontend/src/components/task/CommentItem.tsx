import React from 'react';
import { Comment } from '../../types/task';
import Avatar from '../ui/Avatar';

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  onDelete: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, onDelete }) => {
  const isOwner = comment.userId === currentUserId;

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex gap-3 group">
      <Avatar src={null} alt={comment.userName} size="sm" />

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{comment.userName}</span>
          <span className="text-xs text-outline">{formatTimestamp(comment.createdAt)}</span>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed">{comment.content}</p>
      </div>

      {isOwner && (
        <button
          onClick={() => onDelete(comment.id)}
          className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all self-start"
          aria-label="Delete comment"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      )}
    </div>
  );
};

export default CommentItem;

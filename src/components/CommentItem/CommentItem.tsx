import type { FC } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Comment } from '../../types/Comment';
import './CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { user, isAuthorized } = useAuth();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const canDelete = user && (user.uid === comment.authorId || isAuthorized);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar este comentário?')) {
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        alert(error instanceof Error ? error.message : 'Falha ao deletar comentário');
      }
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        {comment.authorPhoto ? (
          <img 
            src={comment.authorPhoto} 
            alt={`Avatar de ${comment.authorName}`}
            className="comment-avatar-img"
          />
        ) : (
          <div className="comment-avatar-placeholder">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.authorName}</span>
          <span className="comment-date">{formatDate(comment.date)}</span>
          
          {canDelete && (
            <button 
              className="comment-delete-btn"
              onClick={handleDelete}
              aria-label="Deletar comentário"
              title="Deletar comentário"
            >
              🗑️
            </button>
          )}
        </div>
        
        <div className="comment-text">
          {comment.content}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
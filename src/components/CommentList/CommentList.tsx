import type { FC } from 'react';
import CommentItem from '../CommentItem/CommentItem';
import CommentForm from '../CommentForm/CommentForm';
import { useComments } from '../../hooks/useComments';
import type { CommentFormData } from '../../types/Comment';
import './CommentList.css';

interface CommentListProps {
  postId: string;
  onOpenAuthModal: () => void;
}

const CommentList: FC<CommentListProps> = ({ postId, onOpenAuthModal }) => {
  const {
    comments,
    loading,
    error,
    submitting,
    isOnline,
    createComment,
    deleteComment
  } = useComments(postId);

  const handleSubmitComment = async (data: CommentFormData) => {
    await createComment(data);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  if (!isOnline) {
    return (
      <div className="comments-offline">
        <p className="offline-message">
          📡 Você está offline. Comentários não estão disponíveis no modo offline.
        </p>
      </div>
    );
  }

  return (
    <div className="comment-list-container">
      <div className="comments-header">
        <h3 className="comments-title">
          💬 Comentários {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      <CommentForm 
        onSubmit={handleSubmitComment}
        onOpenAuthModal={onOpenAuthModal}
        submitting={submitting}
      />

      {error && (
        <div className="comments-error">
          ⚠️ {error}
          {error.includes('sincronização') && (
            <div className="error-hint">
              <small>
                💡 Dica: Pode ser necessário criar um índice no Firestore. 
                Verifique o console do navegador para mais detalhes.
              </small>
            </div>
          )}
        </div>
      )}

      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <div className="comments-loading">
            <div className="loading-spinner">⏳</div>
            <span>Carregando comentários...</span>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <div className="comments-empty">
            <div className="empty-icon">💭</div>
            <p>Seja o primeiro a comentar!</p>
            <p className="empty-subtitle">Compartilhe seus pensamentos sobre este post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
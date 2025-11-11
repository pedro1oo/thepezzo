import type { FC } from 'react';
import { useState } from 'react';
import type { Post } from '../../types/Post';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import CommentList from '../CommentList/CommentList';
import { useAuth } from '../../contexts/AuthContext';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onLike: (postId: string, currentUserId: string | undefined, isCurrentlyLiked: boolean) => void;
  onOpenAuthModal: () => void;
}

const PostCard: FC<PostCardProps> = ({ post, onEdit, onDelete, onLike, onOpenAuthModal }) => {
  const { user, isAuthorized } = useAuth();
  const [showComments, setShowComments] = useState(false);
  
  // Verificar se o usuário atual curtiu o post
  const isLiked = user && post.likes ? post.likes.includes(user.uid) : false;
  const likeCount = post.likeCount || 0;

  const handleLike = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    onLike(post.id, user.uid, isLiked);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMoodIcon = (mood?: Post['mood']) => {
    switch (mood) {
      case 'positive': return '🚀';
      case 'contemplative': return '🌌';
      case 'ambitious': return '⭐';
      default: return '🛸';
    }
  };

  const getMoodColor = (mood?: Post['mood']) => {
    switch (mood) {
      case 'positive': return 'var(--accent-orange)';
      case 'contemplative': return 'var(--accent-blue)';
      case 'ambitious': return 'var(--text-accent)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <article className="post-card animate-slide-up">
      <div className="post-card-header">
        <div className="post-meta">
          <span 
            className="mood-indicator"
            style={{ color: getMoodColor(post.mood) }}
          >
            {getMoodIcon(post.mood)}
          </span>
          <time className="post-date">{formatDate(post.date)}</time>
        </div>
        
        {isAuthorized && (
          <div className="post-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => onEdit(post)}
              aria-label="Editar post"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => onDelete(post.id)}
              aria-label="Deletar post"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-text">
          <MarkdownRenderer content={post.content} className="post-markdown" />
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="post-footer">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Descurtir post' : 'Curtir post'}
          title={user ? (isLiked ? 'Descurtir' : 'Curtir') : 'Faça login para curtir'}
        >
          <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likeCount}</span>
        </button>

        <button 
          className="comments-toggle-btn"
          onClick={() => setShowComments(!showComments)}
          aria-label={showComments ? 'Ocultar comentários' : 'Mostrar comentários'}
        >
          <span className="btn-icon">💬</span>
          <span className="btn-text">
            {showComments ? 'Ocultar' : 'Comentários'}
          </span>
        </button>
      </div>

      {showComments && (
        <CommentList 
          postId={post.id}
          onOpenAuthModal={onOpenAuthModal}
        />
      )}

      <div className="post-card-glow"></div>
    </article>
  );
};

export default PostCard;
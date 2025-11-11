import type { FC } from 'react';
import type { Post } from '../../types/Post';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import { useAuth } from '../../contexts/AuthContext';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const { isAuthorized } = useAuth();
  
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

      <div className="post-card-glow"></div>
    </article>
  );
};

export default PostCard;
import type { FC } from 'react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CommentFormData } from '../../types/Comment';
import './CommentForm.css';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  onOpenAuthModal: () => void;
  submitting: boolean;
}

const CommentForm: FC<CommentFormProps> = ({ onSubmit, onOpenAuthModal, submitting }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, escreva um comentário');
      return;
    }

    if (!user) {
      // Mostrar dica visual e abrir modal
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 2000);
      onOpenAuthModal();
      return;
    }

    try {
      setError(null);
      await onSubmit({ content: content.trim() });
      setContent(''); // Limpar formulário após sucesso
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      setError(error instanceof Error ? error.message : 'Falha ao enviar comentário');
    }
  };

  return (
    <div className="comment-form-container">
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-header">
          <div className="comment-author-info">
            {user ? (
              <>
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Seu avatar" 
                    className="comment-author-avatar"
                  />
                ) : (
                  <div className="comment-author-avatar comment-author-avatar-placeholder">
                    {user.displayName?.charAt(0) || '👤'}
                  </div>
                )}
                <span className="comment-author-name">
                  {user.displayName || 'Usuário'}
                </span>
              </>
            ) : (
              <>
                <div className="comment-author-avatar comment-author-avatar-placeholder">
                  👤
                </div>
                <span className="comment-author-name">
                  Escreva seu comentário e faça login
                </span>
              </>
            )}
          </div>
        </div>

        <div className="comment-form-body">
          <textarea
            className="comment-textarea"
            placeholder="Escreva seu comentário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            rows={3}
            maxLength={500}
          />
          
          {error && (
            <div className="comment-error">
              {error}
            </div>
          )}

          {!user && content.trim() && (
            <div className="login-hint-message">
              💡 Você pode escrever seu comentário e depois fazer login para publicar!
            </div>
          )}
          
          <div className="comment-form-footer">
            <div className="comment-char-count">
              {content.length}/500
            </div>
            
            <button
              type="submit"
              className={`comment-submit-btn ${showLoginHint ? 'login-hint' : ''}`}
              disabled={!content.trim() || submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  Enviando...
                </>
              ) : user ? (
                <>
                  <span className="btn-icon">💬</span>
                  Comentar
                </>
              ) : (
                <>
                  <span className="btn-icon">🔑</span>
                  Fazer Login e Comentar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
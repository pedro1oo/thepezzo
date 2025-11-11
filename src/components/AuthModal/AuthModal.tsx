import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, signInWithGoogle, signOut, isAuthorized } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      // Só fecha o modal se o login for bem-sucedido E o usuário estiver autorizado
      // ou se quisermos permitir que usuários não autorizados vejam o status
      onClose();
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error instanceof Error ? error.message : 'Falha no login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erro no logout:', error);
      setError('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>🚀 Acesso ao Pezzo</h2>
          <button 
            className="auth-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="auth-modal-content">
          {error && (
            <div className="auth-error">
              <p className="auth-error-message">❌ {error}</p>
              <div className="auth-error-help">
                <p><strong>Possíveis soluções:</strong></p>
                <ul>
                  <li>Verifique se pop-ups estão permitidos no navegador</li>
                  <li>Tente em uma aba anônima/incógnita</li>
                  <li>Verifique sua conexão com a internet</li>
                  <li>Recarregue a página e tente novamente</li>
                </ul>
              </div>
              <button 
                className="auth-button auth-button-retry"
                onClick={handleTryAgain}
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {!user ? (
            <div className="auth-signin">
              {!error && (
                <>
                  <p className="auth-description">
                    Faça login para criar e gerenciar seus posts
                  </p>
                  <p className="auth-note">
                    <strong>Nota:</strong> Visitantes podem ver os posts, mas apenas o autor pode criar novos conteúdos.
                  </p>
                </>
              )}
              <button 
                className="auth-button auth-button-google"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner">🔄</span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <span className="auth-icon">🚀</span>
                    Entrar com Google
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="auth-user-info">
              {isAuthorized ? (
                <div className="auth-authorized">
                  <div className="auth-user-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" />
                    ) : (
                      <div className="auth-user-initial">
                        {user.displayName?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                  <div className="auth-user-details">
                    <h3>Olá, {user.displayName}! 👋</h3>
                    <p className="auth-user-email">{user.email}</p>
                    <p className="auth-status-success">✅ Autorizado para criar posts</p>
                  </div>
                  <button 
                    className="auth-button auth-button-signout"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    {loading ? 'Saindo...' : 'Sair'}
                  </button>
                </div>
              ) : (
                <div className="auth-unauthorized">
                  <div className="auth-user-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" />
                    ) : (
                      <div className="auth-user-initial">
                        {user.displayName?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                  <div className="auth-user-details">
                    <h3>{user.displayName}</h3>
                    <p className="auth-user-email">{user.email}</p>
                    <p className="auth-status-error">❌ Não autorizado para criar posts</p>
                    <p className="auth-help-text">
                      Este blog é pessoal. Você pode visualizar os posts, mas apenas o autor pode criar novos conteúdos.
                    </p>
                  </div>
                  <button 
                    className="auth-button auth-button-signout"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    {loading ? 'Saindo...' : 'Sair'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
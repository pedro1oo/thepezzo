import type { FC } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  onNewPost: () => void;
  onManageData: () => void;
  onAuthModal: () => void;
}

const Header: FC<HeaderProps> = ({ onNewPost, onManageData, onAuthModal }) => {
  const { user, isAuthorized } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <div className="logo animate-float">
              <img src="/src/assets/pezzo.jpg" alt="PEZZO Logo" width="40" height="40" />
            </div>
            <h1 className="brand-text text-display text-gradient">PEZZO</h1>
            <p className="brand-subtitle">Pensamentos em Órbita</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="auth-btn"
              onClick={onAuthModal}
              aria-label={user ? "Perfil do usuário" : "Fazer login"}
              title={user ? `Logado como ${user.displayName}` : "Fazer login"}
            >
              {user ? (
                <span className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" />
                  ) : (
                    <span className="user-initial">
                      {user.displayName?.charAt(0) || '👤'}
                    </span>
                  )}
                  {isAuthorized && <span className="auth-badge">✓</span>}
                </span>
              ) : (
                <span className="btn-icon">🚀</span>
              )}
            </button>

            <button 
              className="manage-data-btn"
              onClick={onManageData}
              aria-label="Gerenciar dados"
              title="Exportar/Importar dados"
            >
              <span className="btn-icon">☁️</span>
            </button>
            
            {isAuthorized && (
              <button 
                className="new-post-btn animate-pulse-glow"
                onClick={onNewPost}
                aria-label="Criar novo post"
              >
                <span className="btn-icon">+</span>
                <span className="btn-text">Novo Pensamento</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
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
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <path d="M16 2C16 2 22 6 22 14C22 14 24 16 24 18C24 20 22 22 20 22H12C10 22 8 20 8 18C8 16 10 14 10 14C10 6 16 2 16 2Z" fill="url(#rocketGradient)"/>
                <path d="M13 12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13C13.4477 13 13 12.5523 13 12Z" fill="#1e293b"/>
                <path d="M17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14C19 14.5523 18.5523 15 18 15C17.4477 15 17 14.5523 17 14Z" fill="#1e293b"/>
                <path d="M12 22L10 28L14 26L16 30L18 26L22 28L20 22" fill="#ef4444"/>
              </svg>
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
import type { FC } from 'react';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
  isOnline: boolean;
  syncing: boolean;
  error: string | null;
  onSync: () => void;
}

const ConnectionStatus: FC<ConnectionStatusProps> = ({ isOnline, syncing, error, onSync }) => {
  if (!error && isOnline && !syncing) {
    return null; // Não mostrar nada se estiver tudo OK
  }

  return (
    <div className={`connection-status ${!isOnline ? 'offline' : error ? 'error' : 'syncing'}`}>
      <div className="container">
        <div className="status-content">
          <div className="status-info">
            {syncing ? (
              <>
                <span className="status-icon animate-pulse">🔄</span>
                <span className="status-text">Sincronizando...</span>
              </>
            ) : !isOnline ? (
              <>
                <span className="status-icon">📱</span>
                <span className="status-text">Modo offline - mudanças serão sincronizadas quando conectar</span>
              </>
            ) : error ? (
              <>
                <span className="status-icon">⚠️</span>
                <span className="status-text">{error}</span>
              </>
            ) : null}
          </div>
          
          {error && isOnline && (
            <button 
              className="sync-btn"
              onClick={onSync}
              disabled={syncing}
            >
              {syncing ? 'Sincronizando...' : 'Tentar Novamente'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
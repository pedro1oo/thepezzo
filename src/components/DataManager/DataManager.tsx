import React from 'react';
import type { Post } from '../../types/Post';
import './DataManager.css';

interface DataManagerProps {
  posts: Post[];
  onImportPosts: (posts: Post[]) => void;
  onClose: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ posts, onImportPosts, onClose }) => {
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pezzo-thoughts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const markdownContent = generateMarkdown(posts);
    const dataBlob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pezzo-thoughts-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateMarkdown = (posts: Post[]): string => {
    const sortedPosts = [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let markdown = `# 🚀 Pezzo - Meus Pensamentos\n\n`;
    markdown += `Exportado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    markdown += `Total de pensamentos: ${posts.length}\n\n---\n\n`;

    sortedPosts.forEach((post, index) => {
      const moodEmoji = getMoodEmoji(post.mood);
      const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      markdown += `## ${moodEmoji} ${post.title}\n\n`;
      markdown += `**Data:** ${formattedDate}\n\n`;
      markdown += `${post.content}\n\n`;
      
      if (post.tags && post.tags.length > 0) {
        markdown += `**Tags:** ${post.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
      }
      
      if (index < sortedPosts.length - 1) {
        markdown += `---\n\n`;
      }
    });

    return markdown;
  };

  const getMoodEmoji = (mood?: Post['mood']) => {
    switch (mood) {
      case 'positive': return '🚀';
      case 'contemplative': return '🌌';
      case 'ambitious': return '⭐';
      default: return '🛸';
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedPosts = JSON.parse(content).map((post: any) => ({
          ...post,
          date: new Date(post.date)
        }));
        
        if (Array.isArray(importedPosts) && importedPosts.length > 0) {
          const confirmImport = window.confirm(
            `Encontrados ${importedPosts.length} pensamentos para importar. Isso substituirá todos os dados atuais. Continuar?`
          );
          
          if (confirmImport) {
            onImportPosts(importedPosts);
            onClose();
          }
        } else {
          alert('Arquivo inválido ou vazio.');
        }
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
        alert('Erro ao importar arquivo. Verifique se é um arquivo JSON válido.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleCopyToClipboard = async () => {
    try {
      const dataStr = JSON.stringify(posts, null, 2);
      await navigator.clipboard.writeText(dataStr);
      alert('Dados copiados para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar para área de transferência:', error);
      alert('Erro ao copiar dados. Tente usar a exportação em arquivo.');
    }
  };

  return (
    <div className="data-manager-overlay">
      <div className="data-manager-container glass-effect animate-slide-up">
        <div className="data-manager-header">
          <h2 className="manager-title text-display">
            Gerenciar Dados
          </h2>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="data-manager-content">
          <div className="data-stats">
            <div className="stat-item">
              <span className="stat-number text-accent">{posts.length}</span>
              <span className="stat-label">Pensamentos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number text-accent">
                {posts.reduce((acc, post) => acc + post.content.length, 0)}
              </span>
              <span className="stat-label">Caracteres</span>
            </div>
          </div>

          <div className="action-section">
            <h3 className="section-title">📤 Exportar Dados</h3>
            <p className="section-description">
              Salve seus pensamentos para acessar em outros dispositivos
            </p>
            
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={handleExportJSON}
                disabled={posts.length === 0}
              >
                <span className="btn-icon">💾</span>
                Baixar JSON
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={handleExportMarkdown}
                disabled={posts.length === 0}
              >
                <span className="btn-icon">📝</span>
                Baixar Markdown
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={handleCopyToClipboard}
                disabled={posts.length === 0}
              >
                <span className="btn-icon">📋</span>
                Copiar para Área de Transferência
              </button>
            </div>
          </div>

          <div className="action-section">
            <h3 className="section-title">📥 Importar Dados</h3>
            <p className="section-description">
              Restaure seus pensamentos de um backup anterior
            </p>
            
            <div className="import-area">
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="file-input"
                id="import-file"
              />
              <label htmlFor="import-file" className="file-label">
                <span className="btn-icon">📁</span>
                Selecionar Arquivo JSON
              </label>
            </div>
          </div>

          <div className="sync-options">
            <h3 className="section-title">☁️ Opções de Sincronização</h3>
            <div className="sync-methods">
              <div className="sync-method">
                <strong>GitHub Gist:</strong> Crie um Gist privado e salve o JSON dos seus dados
              </div>
              <div className="sync-method">
                <strong>Google Drive:</strong> Salve o arquivo JSON em uma pasta sincronizada
              </div>
              <div className="sync-method">
                <strong>Dropbox/OneDrive:</strong> Use a pasta de sincronização da nuvem
              </div>
              <div className="sync-method">
                <strong>Email:</strong> Envie o arquivo JSON para você mesmo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;
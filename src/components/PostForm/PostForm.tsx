import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Post, PostFormData } from '../../types/Post';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import './PostForm.css';

interface PostFormProps {
  post?: Post | null;
  onSubmit: (data: PostFormData) => void;
  onCancel: () => void;
}

const PostForm: FC<PostFormProps> = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    tags: [],
    mood: 'neutral'
  });

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags || [],
        mood: post.mood || 'neutral'
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="post-form-overlay">
      <div className="post-form-container glass-effect animate-slide-up">
        <div className="post-form-header">
          <h2 className="form-title text-display">
            {post ? 'Editar Pensamento' : 'Novo Pensamento'}
          </h2>
          <button 
            className="close-btn"
            onClick={onCancel}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="O que está pensando hoje?"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <div className="textarea-header">
              <label htmlFor="content" className="form-label">
                Conteúdo (Suporte ao Markdown)
              </label>
              <div className="textarea-controls">
                <button
                  type="button"
                  className={`preview-btn ${showPreview ? 'active' : ''}`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? '✏️ Editar' : '👁️ Preview'}
                </button>
              </div>
            </div>
            
            <div className="content-input-container">
              {!showPreview ? (
                <textarea
                  id="content"
                  className="form-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Compartilhe seus pensamentos...

Você pode usar **Markdown**:
- **Negrito** com **texto**
- *Itálico* com *texto*
- # Títulos
- [Links](https://example.com)
- `código inline`
- > Citações
- Lista com -"
                  rows={8}
                  required
                />
              ) : (
                <div className="markdown-preview">
                  {formData.content.trim() ? (
                    <MarkdownRenderer content={formData.content} />
                  ) : (
                    <p className="preview-placeholder">
                      Preview do Markdown aparecerá aqui...
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="markdown-help">
              <details>
                <summary>💡 Guia rápido do Markdown</summary>
                <div className="markdown-guide">
                  <div className="guide-item">
                    <code>**negrito**</code> → <strong>negrito</strong>
                  </div>
                  <div className="guide-item">
                    <code>*itálico*</code> → <em>itálico</em>
                  </div>
                  <div className="guide-item">
                    <code># Título</code> → Título grande
                  </div>
                  <div className="guide-item">
                    <code>[link](url)</code> → Link clicável
                  </div>
                  <div className="guide-item">
                    <code>`código`</code> → <code>código inline</code>
                  </div>
                  <div className="guide-item">
                    <code>&gt; citação</code> → Bloco de citação
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mood" className="form-label">
              Estado de Espírito
            </label>
            <select
              id="mood"
              className="form-select"
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                mood: e.target.value as Post['mood'] 
              }))}
            >
              <option value="neutral">🛸 Neutro</option>
              <option value="positive">🚀 Positivo</option>
              <option value="contemplative">🌌 Contemplativo</option>
              <option value="ambitious">⭐ Ambicioso</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <div className="tags-input-container">
              <input
                id="tags"
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Adicionar tag..."
              />
              <button 
                type="button"
                className="add-tag-btn"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                +
              </button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="tags-display">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    #{tag}
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remover tag ${tag}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              {post ? 'Atualizar' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
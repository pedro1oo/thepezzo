

import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import PostList from './components/PostList/PostList';
import PostForm from './components/PostForm/PostForm';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import DataManager from './components/DataManager/DataManager';
import AuthModal from './components/AuthModal/AuthModal';
import { usePosts } from './hooks/usePosts';
import { useAuth } from './contexts/AuthContext';
import type { Post, PostFormData } from './types/Post';
import './App.css';

function AppContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isAuthorized } = useAuth();

  // Usando o hook personalizado para gerenciar posts com Firebase
  const { 
    posts, 
    loading, 
    error, 
    syncing, 
    isOnline, 
    createPost, 
    updatePost, 
    deletePost,
    toggleLike,
    syncPosts 
  } = usePosts();

  const handleNewPost = () => {
    if (!isAuthorized) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleManageData = () => {
    setIsDataManagerOpen(true);
  };

  const handleAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    if (!isAuthorized) {
      alert('❌ Apenas o autor pode editar posts. Faça login com a conta autorizada.');
      return;
    }
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!isAuthorized) {
      alert('❌ Apenas o autor pode deletar posts. Faça login com a conta autorizada.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja deletar este pensamento?')) {
      try {
        await deletePost(id);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
        alert(error instanceof Error ? error.message : 'Falha ao deletar o post. Tente novamente.');
      }
    }
  };

  const handleLikePost = async (postId: string, currentUserId: string | undefined, isCurrentlyLiked: boolean) => {
    try {
      await toggleLike(postId, currentUserId, isCurrentlyLiked);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      alert(error instanceof Error ? error.message : 'Falha ao curtir o post. Tente novamente.');
    }
  };

  const handleSubmitPost = async (data: PostFormData) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data);
      } else {
        await createPost(data);
      }
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      alert(error instanceof Error ? error.message : 'Falha ao salvar o post. Tente novamente.');
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleImportPosts = async (importedPosts: Post[]) => {
    if (!isAuthorized) {
      alert('❌ Apenas o autor pode importar posts. Faça login com a conta autorizada.');
      return;
    }

    try {
      // Criar todos os posts importados
      for (const post of importedPosts) {
        await createPost({
          title: post.title,
          content: post.content,
          tags: post.tags,
          mood: post.mood
        });
      }
      alert(`${importedPosts.length} posts importados com sucesso!`);
      handleCloseDataManager();
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert(error instanceof Error ? error.message : 'Falha ao importar dados. Tente novamente.');
    }
  };

  const handleCloseDataManager = () => {
    setIsDataManagerOpen(false);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner animate-pulse-glow">🚀</div>
          <p className="loading-text">Carregando pensamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <ConnectionStatus 
        isOnline={isOnline}
        syncing={syncing}
        error={error}
        onSync={syncPosts}
      />
      
      <Header 
        onNewPost={handleNewPost}
        onManageData={handleManageData}
        onAuthModal={handleAuthModal}
      />
      
      <main className="main-content">
        <div className="container">
          {!isAuthorized && posts.length === 0 ? (
            <div className="welcome-message">
              <h2>👋 Bem-vindo ao Pezzo!</h2>
              <p>Este é o blog pessoal de pensamentos. Você pode visualizar os posts publicados aqui.</p>
              <p>O autor pode fazer login para criar novos conteúdos.</p>
            </div>
          ) : (
            <PostList 
              posts={posts}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              onLikePost={handleLikePost}
              onOpenAuthModal={handleAuthModal}
            />
          )}
        </div>
      </main>

      {isFormOpen && (
        <PostForm
          post={editingPost}
          onSubmit={handleSubmitPost}
          onCancel={handleCancelForm}
        />
      )}

      {isDataManagerOpen && (
        <DataManager
          posts={posts}
          onImportPosts={handleImportPosts}
          onClose={handleCloseDataManager}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;



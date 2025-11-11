import { useState, useEffect, useCallback } from 'react';
import { postsService } from '../firebase/postsService';
import { useOnlineStatus } from './useOnlineStatus';
import type { Post, PostFormData } from '../types/Post';

const LOCAL_STORAGE_KEY = 'pezzo-posts';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const isOnline = useOnlineStatus();

  // Carregar posts do localStorage
  const loadLocalPosts = useCallback(() => {
    try {
      const savedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          date: new Date(post.date)
        }));
        return parsedPosts;
      }
    } catch (error) {
      console.error('Erro ao carregar posts locais:', error);
    }
    return [];
  }, []);

  // Salvar posts no localStorage
  const saveLocalPosts = useCallback((postsToSave: Post[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(postsToSave));
    } catch (error) {
      console.error('Erro ao salvar posts locais:', error);
    }
  }, []);

  // Sincronizar posts locais com Firebase
  const syncPosts = useCallback(async () => {
    if (!isOnline) {
      setError('Você está offline');
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      
      console.log('Iniciando sincronização...');
      
      // Carregar posts do Firebase
      const firebasePosts = await postsService.getPosts();
      console.log('Posts carregados do Firebase:', firebasePosts.length);
      
      setPosts(firebasePosts);
      saveLocalPosts(firebasePosts);
      
      console.log('Sincronização concluída');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      setError('Falha na sincronização - verifique sua conexão');
      
      // Em caso de erro, carregar do localStorage
      const localPosts = loadLocalPosts();
      setPosts(localPosts);
    } finally {
      setSyncing(false);
    }
  }, [isOnline, loadLocalPosts, saveLocalPosts]);

  // Carregar posts iniciais
  useEffect(() => {
    const initializePosts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Inicializando posts, online:', isOnline);
        
        if (isOnline) {
          // Se online, tentar carregar do Firebase
          console.log('Tentando carregar do Firebase...');
          await syncPosts();
        } else {
          // Se offline, carregar do localStorage
          console.log('Carregando posts locais (offline)...');
          const localPosts = loadLocalPosts();
          setPosts(localPosts);
          setError('Modo offline - posts salvos localmente');
        }
      } catch (error) {
        console.error('Erro ao inicializar posts:', error);
        // Em caso de erro, sempre carregar do localStorage
        const localPosts = loadLocalPosts();
        setPosts(localPosts);
        setError('Falha ao conectar com o servidor - carregando posts locais');
      } finally {
        setLoading(false);
      }
    };

    initializePosts();
  }, [isOnline, syncPosts, loadLocalPosts]);

  // Configurar listener em tempo real quando online
  useEffect(() => {
    if (!isOnline) return;

    console.log('Configurando listener em tempo real...');

    const unsubscribe = postsService.subscribeToPostsChanges(
      (updatedPosts) => {
        console.log('Posts atualizados via listener:', updatedPosts.length);
        setPosts(updatedPosts);
        saveLocalPosts(updatedPosts);
        // Limpar erro se a sincronização estiver funcionando
        setError(null);
      },
      (error: Error) => {
        console.error('Erro no listener:', error);
        setError('Problema na sincronização em tempo real');
      }
    );

    return () => {
      console.log('Removendo listener...');
      unsubscribe();
    };
  }, [isOnline, saveLocalPosts]);

  // Criar post
  const createPost = useCallback(async (postData: PostFormData) => {
    try {
      setError(null);
      console.log('usePosts: Tentando criar post...', postData);
      
      if (isOnline) {
        // Se online, criar no Firebase
        console.log('usePosts: Criando no Firebase...');
        const newPostId = await postsService.createPost(postData);
        console.log('usePosts: Post criado no Firebase com ID:', newPostId);
      } else {
        // Se offline, criar localmente
        console.log('usePosts: Criando localmente (offline)...');
        const newPost: Post = {
          id: crypto.randomUUID(),
          ...postData,
          date: new Date()
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        saveLocalPosts(updatedPosts);
        console.log('usePosts: Post criado localmente');
      }
    } catch (error) {
      console.error('usePosts: Erro ao criar post:', error);
      setError(error instanceof Error ? error.message : 'Falha ao criar post');
      throw error;
    }
  }, [isOnline, posts, saveLocalPosts]);

  // Atualizar post
  const updatePost = useCallback(async (id: string, postData: Partial<PostFormData>) => {
    try {
      setError(null);
      
      if (isOnline) {
        // Se online, atualizar no Firebase
        await postsService.updatePost(id, postData);
      } else {
        // Se offline, atualizar localmente
        const updatedPosts = posts.map(post =>
          post.id === id ? { ...post, ...postData } : post
        );
        setPosts(updatedPosts);
        saveLocalPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      setError('Falha ao atualizar post');
      throw error;
    }
  }, [isOnline, posts, saveLocalPosts]);

  // Deletar post
  const deletePost = useCallback(async (id: string) => {
    try {
      setError(null);
      
      if (isOnline) {
        // Se online, deletar do Firebase
        await postsService.deletePost(id);
      } else {
        // Se offline, deletar localmente
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        saveLocalPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      setError('Falha ao deletar post');
      throw error;
    }
  }, [isOnline, posts, saveLocalPosts]);

  return {
    posts,
    loading,
    error,
    syncing,
    isOnline,
    createPost,
    updatePost,
    deletePost,
    syncPosts
  };
};
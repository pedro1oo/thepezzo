import { useState, useEffect, useCallback } from 'react';
import { commentsService } from '../firebase/commentsService';
import { useOnlineStatus } from './useOnlineStatus';
import type { Comment, CommentFormData } from '../types/Comment';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isOnline = useOnlineStatus();

  // Carregar comentários iniciais
  const loadComments = useCallback(async () => {
    if (!postId || !isOnline) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando comentários para post:', postId);
      const postComments = await commentsService.getCommentsByPostId(postId);
      setComments(postComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      setError(error instanceof Error ? error.message : 'Falha ao carregar comentários');
    } finally {
      setLoading(false);
    }
  }, [postId, isOnline]);

  // Configurar listener em tempo real
  useEffect(() => {
    if (!postId || !isOnline) {
      setComments([]);
      setError(null);
      setLoading(false);
      return;
    }

    console.log('Configurando listener para comentários do post:', postId);
    setLoading(true);

    const unsubscribe = commentsService.subscribeToComments(
      postId,
      (updatedComments) => {
        console.log('Comentários atualizados via listener:', updatedComments.length);
        setComments(updatedComments);
        setError(null);
        setLoading(false);
      },
      (error: Error) => {
        console.error('Erro no listener de comentários:', error);
        setError('Problema na sincronização de comentários');
        setLoading(false);
        
        // Fallback: tentar carregar uma vez sem listener
        loadComments();
      }
    );

    return () => {
      console.log('Removendo listener de comentários...');
      unsubscribe();
    };
  }, [postId, isOnline, loadComments]);

  // Criar comentário
  const createComment = useCallback(async (commentData: CommentFormData) => {
    if (!isOnline) {
      throw new Error('❌ Você precisa estar online para comentar');
    }

    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Criando comentário:', commentData);
      await commentsService.createComment(postId, commentData);
      console.log('Comentário criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Falha ao criar comentário';
      setError(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [postId, isOnline]);

  // Deletar comentário
  const deleteComment = useCallback(async (commentId: string) => {
    if (!isOnline) {
      throw new Error('❌ Você precisa estar online para deletar comentários');
    }

    try {
      setError(null);
      
      console.log('Deletando comentário:', commentId);
      await commentsService.deleteComment(commentId);
      console.log('Comentário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Falha ao deletar comentário';
      setError(errorMessage);
      throw error;
    }
  }, [isOnline]);

  return {
    comments,
    loading,
    error,
    submitting,
    isOnline,
    createComment,
    deleteComment,
    loadComments
  };
};
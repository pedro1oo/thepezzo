import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './config';
import type { Comment, CommentFormData, FirebaseComment } from '../types/Comment';

// Nome da coleção
const COMMENTS_COLLECTION = 'comments';

// Converter comentário para formato Firebase
const commentToFirebase = (commentData: CommentFormData, postId: string): Omit<FirebaseComment, 'id'> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('❌ Usuário deve estar logado para comentar');
  }
  
  return {
    postId,
    authorId: user.uid,
    authorName: user.displayName || user.email || 'Usuário Anônimo',
    authorPhoto: user.photoURL || undefined,
    content: commentData.content.trim(),
    date: serverTimestamp() as Timestamp
  };
};

// Converter documento Firebase para Comment
const firebaseToComment = (doc: any): Comment => ({
  id: doc.id,
  postId: doc.data().postId,
  authorId: doc.data().authorId,
  authorName: doc.data().authorName,
  authorPhoto: doc.data().authorPhoto,
  content: doc.data().content,
  date: doc.data().date?.toDate() || new Date()
});

// Serviços do Firebase para comentários
export const commentsService = {
  // Criar um novo comentário
  async createComment(postId: string, commentData: CommentFormData): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('❌ Você precisa estar logado para comentar');
      }

      if (!commentData.content.trim()) {
        throw new Error('❌ O comentário não pode estar vazio');
      }

      console.log('Criando comentário para post:', postId);
      const commentForFirebase = commentToFirebase(commentData, postId);
      
      const docRef = await addDoc(
        collection(db, COMMENTS_COLLECTION),
        commentForFirebase
      );
      
      console.log('Comentário criado com sucesso, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('❌')) {
          throw error; // Re-throw custom errors as is
        } else if (error.message.includes('permission')) {
          throw new Error('❌ Erro de permissão - verifique as regras do Firestore');
        } else if (error.message.includes('network')) {
          throw new Error('❌ Erro de conexão - verifique sua internet');
        }
      }
      
      throw new Error('Falha ao criar comentário');
    }
  },

  // Obter comentários de um post específico
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      // Tentar primeiro com orderBy (requer índice)
      const q = query(
        collection(db, COMMENTS_COLLECTION),
        where('postId', '==', postId),
        orderBy('date', 'asc')
      );

      console.log('Buscando comentários para post:', postId);
      const querySnapshot = await getDocs(q);
      console.log('Comentários encontrados:', querySnapshot.docs.length);
      
      return querySnapshot.docs.map(firebaseToComment);
    } catch (error: any) {
      console.error('Erro ao buscar comentários com orderBy:', error);
      
      // Se erro de índice, tentar sem orderBy e ordenar no cliente
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Tentando buscar sem orderBy devido a erro de índice...');
        try {
          const fallbackQuery = query(
            collection(db, COMMENTS_COLLECTION),
            where('postId', '==', postId)
          );
          
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const comments = fallbackSnapshot.docs.map(firebaseToComment);
          
          // Ordenar no cliente por data
          comments.sort((a, b) => a.date.getTime() - b.date.getTime());
          
          console.log('Comentários encontrados (sem orderBy):', comments.length);
          return comments;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
          throw new Error('Falha ao carregar comentários');
        }
      }
      
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn('Problema de permissão, retornando comentários vazios');
        return [];
      }
      
      throw new Error('Falha ao carregar comentários');
    }
  },

  // Deletar um comentário (apenas o autor ou o dono do blog)
  async deleteComment(commentId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('❌ Você precisa estar logado para deletar comentários');
      }

      console.log('Deletando comentário:', commentId);
      await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
      console.log('Comentário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      
      if (error instanceof Error && error.message.includes('❌')) {
        throw error;
      }
      
      throw new Error('Falha ao deletar comentário');
    }
  },

  // Escutar mudanças nos comentários de um post em tempo real
  subscribeToComments(
    postId: string,
    callback: (comments: Comment[]) => void,
    onError?: (error: Error) => void
  ) {
    try {
      // Tentar primeiro com orderBy
      const q = query(
        collection(db, COMMENTS_COLLECTION),
        where('postId', '==', postId),
        orderBy('date', 'asc')
      );

      console.log('Configurando listener de comentários para post:', postId);

      return onSnapshot(
        q,
        (querySnapshot) => {
          console.log('Mudança detectada nos comentários:', querySnapshot.docs.length);
          const comments = querySnapshot.docs.map(firebaseToComment);
          callback(comments);
        },
        (error: any) => {
          console.error('Erro no listener de comentários:', error);
          
          // Se erro de índice, tentar fallback sem orderBy
          if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.log('Tentando listener sem orderBy devido a erro de índice...');
            
            const fallbackQuery = query(
              collection(db, COMMENTS_COLLECTION),
              where('postId', '==', postId)
            );
            
            return onSnapshot(
              fallbackQuery,
              (fallbackSnapshot) => {
                console.log('Mudança detectada (fallback):', fallbackSnapshot.docs.length);
                const comments = fallbackSnapshot.docs.map(firebaseToComment);
                // Ordenar no cliente
                comments.sort((a, b) => a.date.getTime() - b.date.getTime());
                callback(comments);
              },
              (fallbackError) => {
                console.error('Erro no fallback listener:', fallbackError);
                if (onError) onError(new Error('Falha na sincronização de comentários'));
              }
            );
          }
          
          if (onError) onError(new Error('Falha na sincronização de comentários'));
        }
      );
    } catch (error) {
      console.error('Erro ao configurar listener de comentários:', error);
      if (onError) onError(new Error('Falha ao configurar sincronização de comentários'));
      return () => {}; // Retorna função vazia se houver erro
    }
  }
};